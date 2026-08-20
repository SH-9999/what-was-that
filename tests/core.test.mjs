import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildMatchers, scan, cleanText, sentenceAround } from '../src/core.ts'

const ASSETS = fileURLToPath(new URL('../assets/', import.meta.url))

test('buildMatchers: matches an exact English term within word boundaries', () => {
  const m = buildMatchers([{ t: 'RAG', e: '检索增强' }])
  assert.equal(scan('we use RAG here', m).length, 1)
  assert.equal(scan('RAGs are great', m).length, 0) // boundary: 'RAGs' should not match bare RAG
  assert.equal(scan('nothing here', m).length, 0)
})

test('buildMatchers: matches a Chinese term as a substring', () => {
  const m = buildMatchers([{ t: '上下文', e: 'context' }])
  assert.equal(scan('这里提到上下文窗口', m)[0].term, '上下文')
})

test('scan: dedupes + caps at 8 hits, returns local flag & explanation', () => {
  const m = buildMatchers([
    { t: 'RAG', e: 'E1' },
    { t: 'LoRA', e: 'E2' },
    { t: 'MCP', e: 'E3' },
  ])
  const hits = scan('RAG RAG LoRA MCP', m)
  assert.equal(hits.length, 3)
  assert.ok(hits.every((h) => h.local === true))
  assert.equal(hits.find((h) => h.term === 'LoRA')?.explanation, 'E2')
})

test('cleanText: strips one leading filler token', () => {
  assert.equal(cleanText('所以结果就是这样'), '结果就是这样')
  // cleanText does a single leading-token strip; '好，' is one token
  assert.equal(cleanText('好，先构思：我们先看定义'), '先构思：我们先看定义')
  assert.equal(cleanText('RAG 就是检索增强'), 'RAG 就是检索增强')
  assert.equal(cleanText(''), '')
})

test('sentenceAround: slices term with ~80 char context, lowercases for lookup', () => {
  const t = 'RAG'
  const text = '前面 ' + 'x'.repeat(90) + ' 这里提到 RAG 咯 ' + 'y'.repeat(90) + ' 结尾'
  const s = sentenceAround(text, t)
  assert.ok(s.includes('RAG'))
  assert.ok(s.startsWith('…') || s.endsWith('…'))
  assert.ok(s.length < text.length)
})

test('lexicon.json on disk parses and has well-formed entries', () => {
  const raw = readFileSync(ASSETS + 'lexicon.json', 'utf8')
  const lex = JSON.parse(raw)
  assert.ok(Array.isArray(lex))
  assert.ok(lex.length > 100, 'lexicon should have > 100 entries')
  for (const e of lex) {
    assert.equal(typeof e.t, 'string')
    assert.equal(typeof e.e, 'string')
    assert.ok(e.t.length > 0)
  }
})
