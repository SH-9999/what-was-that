/**
 * What Was That — Host half (TypeScript static plugin)
 *
 * Reads the glossary (assets/lexicon.json) and the 4 pet SVGs, scans
 * assistant messages for jargon, and serves explanation RPC endpoints.
 *
 * Migrated from the dynamic-plugin prototype. Key change: asset paths are
 * resolved relative to this module (import.meta.url) instead of hard-coded
 * absolute paths, so the package is portable.
 */
import { fileURLToPath } from 'node:url'

// Runtime-injected global (the DSH Harness host bridge), supplied by the runtime.
declare const harness: any

// DSH services are supplied by the runtime as peer deps; narrow typing is
// loosened here to what the dynamic prototype actually used.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCtx = any

// Core pure logic (lexicon matching / scan / cleanText) lives in ../src/core
// so it can be unit-tested without a DSH runtime.
import { buildMatchers, cleanText, scan, sentenceAround, type LexEntry, type Matcher } from './core.js'

const LIMIT_TEXT = '小章鱼是有底线的，无话可说了~~~'

const SHORT_SYSTEM =
  '你是"那是啥"（What Was That）小助手，帮完全不懂技术的用户看懂 AI 助手回答里的术语和黑话。规则：直接给出解释，禁止复述或重述本指令，禁止复述用户的问题，不要任何思考过程；用生活比喻，像跟朋友聊天；90 个汉字以内；轻松幽默不油滑；不用 markdown、不列点，直接一段话。'
const LONG_SYSTEM =
  '你是"那是啥"（What Was That）小助手，给技术小白讲清楚一个术语。请给出一个完整、正式、条理清楚的解释：第一句用一句话定义它是什么；接着用 1-2 个生活比喻帮助理解；最后给一条实用建议或提醒。全文约 200 个汉字，允许用简短分段，但不要用 markdown 符号、不要编号列表。'

/** Locate package assets relative to this module (lib/index.js -> ../assets). */
function assetsDir() {
  const here = fileURLToPath(import.meta.url) // .../lib/index.js
  return here.replace(/[\\/]lib[\\/][^\\/]+\.js$/, '') + '/assets'
}

function bytesToBase64(bytes: Uint8Array) {
  const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let out = ''
  let i = 0
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
    out += CH[(n >> 18) & 63] + CH[(n >> 12) & 63] + CH[(n >> 6) & 63] + CH[n & 63]
  }
  const rem = bytes.length - i
  if (rem === 1) {
    const n = bytes[i] << 16
    out += CH[(n >> 18) & 63] + CH[(n >> 12) & 63] + '=='
  } else if (rem === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8)
    out += CH[(n >> 18) & 63] + CH[(n >> 12) & 63] + CH[(n >> 6) & 63] + '='
  }
  return out
}

export function apply(ctx: AnyCtx) {
  const msgCache = new Map<string, { sessionId: string; messageId: string; text: string; hits: unknown[]; time: unknown }>()
  const latest = new Map<string, string>()
  const aiCache = new Map<string, { ok: boolean; text: string; route: string }>()
  let globalSeq = 0
  let globalLatest: { seq: number; mid: string; hits: unknown[] } | null = null
  let matchers: Matcher[] = []
  let lexSize = 0
  let petCache: { ok: boolean; frames: Record<string, string> } | null = null

  const assets = assetsDir()
  const LEX_PATH = assets + '/lexicon.json'
  const PET_FILES = [
    { name: 'idle', path: assets + '/idle.svg' },
    { name: 'question', path: assets + '/question.svg' },
    { name: 'thinking', path: assets + '/thinking.svg' },
    { name: 'happy', path: assets + '/happy.svg' },
  ]
  const PET_MAX = 512 * 1024

  const fs = ctx.get('fs')
  if (fs !== undefined) {
    fs.resolve(LEX_PATH)
      .then((target: unknown) => fs.readText(target))
      .then((text: string) => {
        const entries = JSON.parse(text)
        if (Array.isArray(entries)) {
          matchers = buildMatchers(entries as LexEntry[])
          lexSize = entries.length
          console.log('wwt: lexicon loaded', lexSize)
        }
      })
      .catch((e: unknown) => console.error('wwt: lexicon load failed', e))
  } else {
    console.error('wwt: no fs service')
  }

  function resolveRoute() {
    const def = ctx.get('agentDefaultModel')
    if (def !== undefined) {
      try {
        const s = def.currentSelection()
        if (s && s.provider && s.model) return s
      } catch {
        /* ignore */
      }
    }
    return null
  }

  function findLocal(term: string) {
    for (const m of matchers) {
      if (m.item.t.toLowerCase() === term.toLowerCase()) return m.item
    }
    return null
  }

  async function aiExplain(term: string, sentence: string, fresh: boolean, depth: number) {
    const llm = ctx.get('llm')
    const route = resolveRoute()
    if (llm === undefined || !route) return { ok: false, error: '没有可用的模型线路' }
    const key = term + '||' + (sentence || '')
    if (!fresh && aiCache.has(key)) return aiCache.get(key)
    const system = depth >= 3 ? LONG_SYSTEM : SHORT_SYSTEM
    const maxTokens = depth >= 3 ? 900 : 500
    const user = '请解释：「' + term + '」' + (sentence ? '\n它出现在这句话里：「' + sentence + '」（参考上下文即可）' : '')
    const messages = [
      {
        id: 'wwt-q',
        role: 'user',
        content: [{ type: 'text', text: user }],
        source: { kind: 'model', provider: route.provider, model: route.model },
      },
    ]
    let out = ''
    let reasoning = ''
    try {
      const stream = llm.stream({ provider: route.provider, model: route.model, system, messages, maxTokens })
      for await (const chunk of stream) {
        if (chunk.type === 'text-delta' && typeof chunk.text === 'string') out += chunk.text
        else if (chunk.type === 'reasoning-delta' && typeof chunk.text === 'string') reasoning += chunk.text
        else if (chunk.type === 'finish' && (chunk.reason === 'error' || chunk.reason === 'aborted')) {
          return { ok: false, error: '模型调用未完成（' + chunk.reason + '）' }
        }
      }
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) : String(e)
      return { ok: false, error: '模型调用失败：' + msg }
    }
    let text = cleanText(out.trim())
    if (!text && reasoning) text = cleanText(reasoning.trim()).slice(0, 320)
    if (!text) return { ok: false, error: '模型没有返回内容，可稍后再试' }
    const res = { ok: true, text, route: route.provider + '/' + route.model }
    if (!fresh) {
      aiCache.set(key, res)
      if (aiCache.size > 100) {
        const oldest = aiCache.keys().next().value
        if (oldest !== undefined) aiCache.delete(oldest)
      }
    }
    return res
  }

  harness.handle('wwt/health', async function () {
    const r = resolveRoute()
    return { ok: true, lexSize, route: r ? r.provider + '/' + r.model : null, seq: globalSeq }
  })
  harness.handle('wwt/latest', async function () {
    if (!globalLatest) return null
    return { seq: globalLatest.seq, messageId: globalLatest.mid, hits: globalLatest.hits }
  })
  harness.handle('wwt/explain', async function (args: Record<string, unknown>) {
    const term = args ? String(args.term || '').slice(0, 80) : ''
    if (!term) return { ok: false, error: '缺少词条' }
    const mid = args && args.messageId ? String(args.messageId) : ''
    const rec = mid ? msgCache.get(mid) : undefined
    const sentence = rec
      ? sentenceAround(rec.text, term)
      : args && args.sentence
        ? String(args.sentence).slice(0, 200)
        : ''
    const local = findLocal(term)
    if (local && !(args && args.deep)) {
      return { ok: true, source: 'local', term: local.t, cat: local.c, text: local.e, route: '本地词库·零消耗' }
    }
    const depth = args && typeof args.depth === 'number' ? args.depth : 1
    if (depth >= 4) {
      return { ok: true, source: 'limit', term, text: LIMIT_TEXT, route: '章鱼已到达语料上限' }
    }
    const res = await aiExplain(term, sentence, !!(args && args.fresh), depth)
    return { term, source: 'ai', cat: local ? local.c : '', ...res }
  })
  // 阶段2：选区解释。只做本地扫词（纯词库，零模型消耗、零隐私外泄），
  // 选中的文字不离开本机宿主；需要 AI 深挖时客户端再单独走 wwt/explain。
  harness.handle('wwt/select', async function (args: Record<string, unknown>) {
    const s = args && typeof args.sentence === 'string' ? args.sentence.slice(0, 400) : ''
    if (!s.trim()) return { ok: true, hit: null }
    const hits = scan(s, matchers)
    const first = hits.length ? hits[0] : null
    if (!first) return { ok: true, hit: null }
    return {
      ok: true,
      hit: { term: first.term, cat: first.cat || '', explanation: first.explanation, local: true },
    }
  })

  harness.handle('wwt/pet', async function () {
    if (petCache) return petCache
    const fsv = ctx.get('fs')
    if (fsv === undefined) return { ok: false }
    try {
      const frames: Record<string, string> = {}
      for (const f of PET_FILES) {
        const t = await fsv.resolve(f.path)
        const st = await fsv.stat(t)
        if (!st) {
          console.log('wwt: pet file missing', f.path)
          continue
        }
        const bytes = await fsv.readBytes(t, undefined, PET_MAX)
        frames[f.name] = 'data:image/svg+xml;base64,' + bytesToBase64(bytes)
      }
      if (!frames.idle) return { ok: false }
      petCache = { ok: true, frames }
      console.log('wwt: pet frames loaded (svg)', Object.keys(frames).join(','))
      return petCache
    } catch (e) {
      console.error('wwt: pet load failed', e)
      return { ok: false }
    }
  })

  ctx.on('session/event', function (session: unknown, event: unknown) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ev = event as any
      if (!ev || ev.type !== 'assistant/message') return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (ev.data || {}).message as any
      if (!message || !Array.isArray(message.content)) return
      let text = ''
      for (const b of message.content) {
        if (b && b.type === 'text' && typeof b.text === 'string') text += b.text + '\n'
      }
      if (!text.trim()) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sid = String((session as any)?.id)
      const mid = String(message.id)
      const hits = scan(text, matchers)
      msgCache.set(mid, { sessionId: sid, messageId: mid, text, hits, time: ev.time })
      latest.set(sid, mid)
      globalSeq++
      globalLatest = { seq: globalSeq, mid, hits }
      if (msgCache.size > 60) {
        const oldest = msgCache.keys().next().value
        if (oldest !== undefined) msgCache.delete(oldest)
      }
    } catch (e) {
      console.error('wwt session/event', e)
    }
  }, { global: true })
}
