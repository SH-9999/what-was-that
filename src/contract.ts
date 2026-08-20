/**
 * What Was That — shared Typert wire contract.
 *
 * Host manifest (`src/typert.ts`, registered via `ctx.typert.register`) and
 * client contribution (`src/client/remote.ts`, mounted via `ctx.remote.$mount`)
 * share this single descriptor set, so the browser bundle and the host gateway
 * stay on one wire definition. Every parameter and result is plain JSON, so
 * all codecs use the schema-free `src-json` mode (validated by the Typert
 * registry's `validateCodec`, which returns immediately for `src-json`).
 */
import type { InvocationDescriptor } from '@deepseek-ai/dsh-typert-protocol'

/** JSON value returned by `wwt/explain`. */
export interface ExplainResult {
  term: string
  cat: string
  text: string
  source: string
  route: string
}

/** One option found by scanning selected text. */
export interface SelectHit {
  term: string
  cat: string
  explanation: string
  local: boolean
}

/** JSON value returned by `wwt/select`. */
export interface SelectResult {
  hit: SelectHit | null
}

/** JSON value returned by `wwt/pet`. */
export interface PetResult {
  frames: Record<string, string>
}

/** JSON value returned by `wwt/latest` (null when nothing scanned yet). */
export interface LatestResult {
  seq: number
  messageId: string
  hits: unknown[]
}

/** JSON value returned by `wwt/health`. */
export interface HealthResult {
  ok: boolean
  lexSize: number
  route: string | null
  seq: number
}

/** The `wwt` namespace's strict invocation descriptors (src-json codecs). */
export const WWT_INVOCATIONS: readonly InvocationDescriptor[] = [
  {
    id: 'what-was-that#wwt/explain',
    service: 'wwt',
    namespace: 'wwt',
    method: 'explain',
    invocation: { kind: 'direct' },
    parameters: [
      { name: 'term', wire: 'term', source: 'json', codec: { mode: 'src-json' } },
      { name: 'messageId', wire: 'messageId', source: 'json', codec: { mode: 'src-json' } },
      { name: 'deep', wire: 'deep', source: 'json', codec: { mode: 'src-json' } },
      { name: 'fresh', wire: 'fresh', source: 'json', codec: { mode: 'src-json' } },
      { name: 'depth', wire: 'depth', source: 'json', codec: { mode: 'src-json' } },
    ],
    result: { mode: 'src-json' },
  },
  {
    id: 'what-was-that#wwt/select',
    service: 'wwt',
    namespace: 'wwt',
    method: 'select',
    invocation: { kind: 'direct' },
    parameters: [{ name: 'sentence', wire: 'sentence', source: 'json', codec: { mode: 'src-json' } }],
    result: { mode: 'src-json' },
  },
  {
    id: 'what-was-that#wwt/pet',
    service: 'wwt',
    namespace: 'wwt',
    method: 'pet',
    invocation: { kind: 'direct' },
    parameters: [],
    result: { mode: 'src-json' },
  },
  {
    id: 'what-was-that#wwt/latest',
    service: 'wwt',
    namespace: 'wwt',
    method: 'latest',
    invocation: { kind: 'direct' },
    parameters: [],
    result: { mode: 'src-json' },
  },
  {
    id: 'what-was-that#wwt/health',
    service: 'wwt',
    namespace: 'wwt',
    method: 'health',
    invocation: { kind: 'direct' },
    parameters: [],
    result: { mode: 'src-json' },
  },
]
