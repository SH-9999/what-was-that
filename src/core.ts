/**
 * What Was That — core pure logic (lexicon matching / scan / cleanText).
 *
 * Kept free of DSH runtime dependencies so it can be unit-tested with node:test.
 */

export interface LexEntry {
  t: string
  a?: string[]
  c?: string
  e: string
}

export function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export interface Matcher {
  item: LexEntry
  pats: RegExp[]
}

export function buildMatchers(entries: LexEntry[]): Matcher[] {
  const matchers: Matcher[] = []
  for (const item of entries) {
    const words = [item.t].concat(item.a || [])
    const pats: RegExp[] = []
    for (const w of words) {
      if (/[\u4e00-\u9fa5]/.test(w)) pats.push(new RegExp(escapeRe(w)))
      else pats.push(new RegExp('(^|[^A-Za-z0-9_-])' + escapeRe(w) + '($|[^A-Za-z0-9_-])', 'i'))
    }
    matchers.push({ item, pats })
  }
  matchers.sort((a, b) => b.item.t.length - a.item.t.length)
  return matchers
}

export interface Hit {
  term: string
  cat: string | undefined
  explanation: string
  local: boolean
}

export function scan(text: string, matchers: Matcher[]): Hit[] {
  const found: Hit[] = []
  const seen: Record<string, boolean> = {}
  for (let i = 0; i < matchers.length && found.length < 8; i++) {
    const m = matchers[i]
    for (let j = 0; j < m.pats.length; j++) {
      if (m.pats[j].test(text)) {
        if (!seen[m.item.t]) {
          seen[m.item.t] = true
          found.push({ term: m.item.t, cat: m.item.c, explanation: m.item.e, local: true })
        }
        break
      }
    }
  }
  return found
}

export function cleanText(s: string) {
  if (!s) return ''
  s = s.trim()
  const idx = s.indexOf('请解释')
  if (idx >= 0) {
    let after = s.slice(idx + 3)
    const colon = after.indexOf('：')
    if (colon >= 0) after = after.slice(colon + 1)
    s = after.trim()
  }
  s = s.replace(/^(所以|那么|首先|好[，,。]?|嗯[，,。]?|先构思[：:]?|因此)/, '').trim()
  return s
}

export function sentenceAround(text: string, term: string) {
  const low = text.toLowerCase()
  const t = term.toLowerCase()
  const i = low.indexOf(t)
  if (i < 0) return ''
  const start = Math.max(0, i - 80)
  const end = Math.min(text.length, i + term.length + 80)
  return (start > 0 ? '…' : '') + text.slice(start, end).replace(/\s+/g, ' ').trim() + (end < text.length ? '…' : '')
}
