/**
 * What Was That — shared Typert wire contract.
 *
 * Host manifest (`src/typert.ts`, via `ctx.typert.register`) and client
 * contribution (`src/client/remote.ts`, via `ctx.remote.$mount`) share this
 * descriptor set, so both halves stay on one wire definition.
 *
 * Every parameter and result uses a STRICT zod codec: the client gateway's
 * `requireStrictCodec` rejects `src-json` codecs at `$mount` time, so these
 * must carry a real parse-able schema (mirroring dsh-at-file).
 */
import { z } from 'zod'
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

/** One selectable model option (provider + model + display name). */
export interface ModelOption {
  provider: string
  model: string
  name: string
}

/** JSON value returned by `wwt/models`. */
export interface ModelsResult {
  /** The conversation's current default route, as `provider/model` (null if none). */
  default: string | null
  models: ModelOption[]
}

/** JSON value returned by `wwt/setRoute`. */
export interface SetRouteResult {
  ok: boolean
}

// --- Strict zod wire codecs ---
const explainResultSchema = z.object({
  term: z.string(),
  cat: z.string(),
  text: z.string(),
  source: z.string(),
  route: z.string(),
})
const selectHitSchema = z.object({
  term: z.string(),
  cat: z.string(),
  explanation: z.string(),
  local: z.boolean(),
})
const selectResultSchema = z.object({ hit: selectHitSchema.nullable() })
const petResultSchema = z.object({ frames: z.record(z.string(), z.string()) })
const latestSchema = z.object({
  seq: z.number(),
  messageId: z.string(),
  hits: z.array(z.unknown()),
})
const latestResultSchema = latestSchema.nullable()
const healthResultSchema = z.object({
  ok: z.boolean(),
  lexSize: z.number(),
  route: z.string().nullable(),
  seq: z.number(),
})
const modelOptionSchema = z.object({
  provider: z.string(),
  model: z.string(),
  name: z.string(),
})
const modelsResultSchema = z.object({
  default: z.string().nullable(),
  models: z.array(modelOptionSchema),
})
const setRouteResultSchema = z.object({ ok: z.boolean() })

/** Build a strict boundary codec for one parameter or result. */
function strict(typeSymbol: string, schema: { parse(value: unknown): unknown }) {
  return { mode: 'strict' as const, typeSymbol, schema }
}

/** The `wwt` namespace's invocation descriptors (strict codecs). */
export const WWT_INVOCATIONS: readonly InvocationDescriptor[] = [
  {
    id: 'what-was-that#wwt/explain',
    service: 'wwt',
    namespace: 'wwt',
    method: 'explain',
    invocation: { kind: 'direct' },
    parameters: [
      { name: 'term', wire: 'term', source: 'json', codec: strict('what-was-that#string', z.string()) },
      { name: 'messageId', wire: 'messageId', source: 'json', codec: strict('what-was-that#string', z.string()) },
      { name: 'deep', wire: 'deep', source: 'json', codec: strict('what-was-that#boolean', z.boolean()) },
      { name: 'fresh', wire: 'fresh', source: 'json', codec: strict('what-was-that#boolean', z.boolean()) },
      { name: 'depth', wire: 'depth', source: 'json', codec: strict('what-was-that#number', z.number()) },
    ],
    result: strict('what-was-that#ExplainResult', explainResultSchema),
  },
  {
    id: 'what-was-that#wwt/select',
    service: 'wwt',
    namespace: 'wwt',
    method: 'select',
    invocation: { kind: 'direct' },
    parameters: [
      { name: 'sentence', wire: 'sentence', source: 'json', codec: strict('what-was-that#string', z.string()) },
    ],
    result: strict('what-was-that#SelectResult', selectResultSchema),
  },
  {
    id: 'what-was-that#wwt/pet',
    service: 'wwt',
    namespace: 'wwt',
    method: 'pet',
    invocation: { kind: 'direct' },
    parameters: [],
    result: strict('what-was-that#PetResult', petResultSchema),
  },
  {
    id: 'what-was-that#wwt/latest',
    service: 'wwt',
    namespace: 'wwt',
    method: 'latest',
    invocation: { kind: 'direct' },
    parameters: [],
    result: strict('what-was-that#LatestResult', latestResultSchema),
  },
  {
    id: 'what-was-that#wwt/health',
    service: 'wwt',
    namespace: 'wwt',
    method: 'health',
    invocation: { kind: 'direct' },
    parameters: [],
    result: strict('what-was-that#HealthResult', healthResultSchema),
  },
  {
    id: 'what-was-that#wwt/models',
    service: 'wwt',
    namespace: 'wwt',
    method: 'models',
    invocation: { kind: 'direct' },
    parameters: [],
    result: strict('what-was-that#ModelsResult', modelsResultSchema),
  },
  {
    id: 'what-was-that#wwt/setRoute',
    service: 'wwt',
    namespace: 'wwt',
    method: 'setRoute',
    invocation: { kind: 'direct' },
    parameters: [
      { name: 'provider', wire: 'provider', source: 'json', codec: strict('what-was-that#string', z.string()) },
      { name: 'model', wire: 'model', source: 'json', codec: strict('what-was-that#string', z.string()) },
    ],
    result: strict('what-was-that#SetRouteResult', setRouteResultSchema),
  },
]
