/**
 * What Was That — Host half (TypeScript static plugin)
 *
 * Reads the glossary (assets/lexicon.json) and the 4 pet SVGs, scans assistant
 * messages for jargon, and serves explanation through the `wwt` Typert Remote
 * service (wire namespace `wwt`). The client reaches the service through
 * `ctx.reflect.get('remote.wwt')`; the host registers the strict manifest via
 * `ctx.typert.register` so the Gateway resolves the endpoints independently of
 * the `@Remote` decorator marker tables.
 *
 * Migrated from the dynamic-plugin prototype (which used the `harness`/`host`
 * bridge). Static plugins loaded by cordis-plugin-loader do NOT get the
 * `harness` global, so RPC must go through the Typert Remote mechanism instead.
 */
import type { Context } from '@deepseek-ai/cordis'
// Type-only: brings the `ctx.typert` Context merge into this program.
import type {} from '@deepseek-ai/dsh-typert-registry'
import { fileURLToPath } from 'node:url'

// Core pure logic (lexicon matching / scan / cleanText) lives in ../src/core
// so it can be unit-tested without a DSH runtime.
import { buildMatchers, cleanText, scan, sentenceAround, type LexEntry, type Matcher } from './core.js'
import { WwtRuntime, type WwtDeps } from './runtime.js'
import { WWT_MANIFEST } from './typert.js'
import type { ExplainResult, HealthResult, LatestResult, ModelOption, ModelsResult, PetResult, SelectHit, SetRouteResult } from './contract.js'

const LIMIT_TEXT = '小章鱼是有底线的，无话可说了~~~'

const SHORT_SYSTEM =
  '你是"那是啥"（What Was That）小助手，帮完全不懂技术的用户看懂 AI 助手回答里的术语和黑话。规则：直接给出解释，禁止复述或重述本指令，禁止复述用户的问题，不要任何思考过程；用生活比喻，像跟朋友聊天；90 个汉字以内；轻松幽默不油滑；不用 markdown、不列点，直接一段话。'
const LONG_SYSTEM =
  '你是"那是啥"（What Was That）小助手，给技术小白讲清楚一个术语。请给出一个完整、正式、条理清楚的解释：第一句用一句话定义它是什么；接着用 1-2 个生活比喻帮助理解；最后给一条实用建议或提醒。全文约 200 个汉字，允许用简短分段，但不要用 markdown 符号、不要编号列表。'

/** Cordis plugin name (the Loader entry and client bundle id). */
export const name = 'what-was-that'

/** Hard dependency: the Typert registry that owns the `wwt` Remote manifest. */
export const inject = ['typert']

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCtx = Context & any

/** A successful model explanation (the aiCache payload, and aiExplain's ok face). */
interface AiOk {
  ok: true
  text: string
  route: string
}

export function apply(ctx: AnyCtx) {
  const msgCache = new Map<string, { sessionId: string; messageId: string; text: string; hits: unknown[]; time: unknown }>()
  const latest = new Map<string, string>()
  const aiCache = new Map<string, AiOk>()
  let globalSeq = 0
  let globalLatest: { seq: number; mid: string; hits: unknown[] } | null = null
  let matchers: Matcher[] = []
  let lexSize = 0
  let petCache: PetResult | null = null
  // 固定给 wwt 用的模型线路（null = 跟随对话用的大模型）。每次 dsh 启动为内存态，
  // 由客户端用 localStorage 里的选择在挂载时调用 setRoute 恢复。
  let fixedRoute: { provider: string; model: string } | null = null

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
    const route = fixedRoute || resolveRoute()
    if (llm === undefined || !route) return { ok: false as const, error: '没有可用的模型线路' }
    const key = term + '||' + (sentence || '')
    if (!fresh) {
      const cached = aiCache.get(key)
      if (cached) return cached
    }
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
          return { ok: false as const, error: '模型调用未完成（' + chunk.reason + '）' }
        }
      }
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) : String(e)
      return { ok: false as const, error: '模型调用失败：' + msg }
    }
    let text = cleanText(out.trim())
    if (!text && reasoning) text = cleanText(reasoning.trim()).slice(0, 320)
    if (!text) return { ok: false as const, error: '模型没有返回内容，可稍后再试' }
    const res = { ok: true as const, text, route: route.provider + '/' + route.model }
    if (!fresh) {
      aiCache.set(key, res)
      if (aiCache.size > 100) {
        const oldest = aiCache.keys().next().value
        if (oldest !== undefined) aiCache.delete(oldest)
      }
    }
    return res
  }

  // --- RPC dep implementations (delegate from the WwtRuntime service) ---

  const deps: WwtDeps = {
    async explain(args): Promise<ExplainResult> {
      const term = String(args.term || '').slice(0, 80)
      if (!term) throw new Error('缺少词条')
      const mid = String(args.messageId || '')
      const rec = mid ? msgCache.get(mid) : undefined
      const sentence = rec ? sentenceAround(rec.text, term) : ''
      const local = findLocal(term)
      if (local && !args.deep) {
        return { source: 'local', term: local.t, cat: local.c || '', text: local.e, route: '本地词库·零消耗' }
      }
      const depth = typeof args.depth === 'number' ? args.depth : 1
      if (depth >= 4) {
        return { source: 'limit', term, cat: '', text: LIMIT_TEXT, route: '章鱼已到达语料上限' }
      }
      const res = await aiExplain(term, sentence, !!args.fresh, depth)
      if (!res.ok) throw new Error(res.error)
      return { term, source: 'ai', cat: local ? local.c || '' : '', text: res.text, route: res.route }
    },

    select(sentence: string): SelectHit | null {
      const s = String(sentence || '').slice(0, 400)
      if (!s.trim()) return null
      const hits = scan(s, matchers)
      const first = hits.length ? hits[0] : null
      if (!first) return null
      return { term: first.term, cat: first.cat || '', explanation: first.explanation, local: true }
    },

    async pet(): Promise<PetResult> {
      if (petCache) return petCache
      const fsv = ctx.get('fs')
      if (fsv === undefined) throw new Error('no fs service')
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
        if (!frames.idle) throw new Error('no idle pet frame')
        petCache = { frames }
        console.log('wwt: pet frames loaded (svg)', Object.keys(frames).join(','))
        return petCache
      } catch (e) {
        console.error('wwt: pet load failed', e)
        throw new Error('pet frames unavailable')
      }
    },

    latest(): LatestResult | null {
      if (!globalLatest) return null
      return { seq: globalLatest.seq, messageId: globalLatest.mid, hits: globalLatest.hits }
    },

    health(): HealthResult {
      const r = resolveRoute()
      return { ok: true, lexSize, route: r ? r.provider + '/' + r.model : null, seq: globalSeq }
    },

    async models(): Promise<ModelsResult> {
      const llm = ctx.get('llm')
      const def = resolveRoute()
      const defaultRoute = def ? def.provider + '/' + def.model : null
      if (!llm || typeof llm.listProviders !== 'function') {
        return { default: defaultRoute, models: [] }
      }
      let providers: Array<{ id: string }> = []
      try {
        providers = llm.listProviders() || []
      } catch {
        providers = []
      }
      const out: ModelOption[] = []
      for (const p of providers) {
        let ms: Array<{ id: string; name?: string }> = []
        try {
          ms = await llm.listModels(p.id) || []
        } catch {
          ms = []
        }
        for (const m of ms) {
          out.push({ provider: p.id, model: m.id, name: m.name || m.id })
        }
      }
      return { default: defaultRoute, models: out }
    },

    setRoute(provider: string, model: string): SetRouteResult {
      if (provider && model) fixedRoute = { provider: provider, model: model }
      else fixedRoute = null
      return { ok: true }
    },
  }

  // Mount the Remote service and register its strict manifest. The Gateway
  // resolves the `wwt/*` endpoints from the manifest, not the decorator table.
  new WwtRuntime(ctx, deps)
  ctx.effect(() => {
    const dispose = ctx.typert.register(WWT_MANIFEST)
    return () => { void dispose() }
  }, 'wwt: typert manifest')

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
