/**
 * What Was That — host Remote service (wire namespace `wwt`).
 *
 * Registered as a TypertRemoteService; the Host Gateway resolves the endpoints
 * from the strict manifest in `src/typert.ts` (`ctx.typert.register`), not from
 * the `@Remote` decorator marker tables (the harness's source-launch dev and a
 * profile-loaded bundle can hold separate copies of the decorator module). The
 * `@Remote` decorators stay for documentation and lib-consistent deployments.
 *
 * All methods exchange plain JSON, so the codecs are schema-free `src-json`.
 */
import type { Context } from '@deepseek-ai/cordis'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type {
  ExplainResult,
  HealthResult,
  LatestResult,
  PetResult,
  SelectHit,
  SelectResult,
} from './contract.js'

/** One `wwt/explain` request, mirrored from the wire args. */
export interface ExplainArgs {
  term: string
  messageId: string
  deep: boolean
  fresh: boolean
  depth: number
}

/** The business logic the runtime delegates to (owned by the apply closure). */
export interface WwtDeps {
  explain(args: ExplainArgs): Promise<ExplainResult>
  select(sentence: string): SelectHit | null
  pet(): Promise<PetResult>
  latest(): LatestResult | null
  health(): HealthResult
}

/** The wwt host service: turns black-box jargon into plain language. */
export class WwtRuntime extends TypertRemoteService {
  constructor(ctx: Context, private readonly deps: WwtDeps) {
    super(ctx, 'wwt')
  }

  /** Explain one term; local lexicon first, then a model deep-dive. */
  @Remote
  async explain(term: string, messageId: string, deep: boolean, fresh: boolean, depth: number): Promise<ExplainResult> {
    return this.deps.explain({ term, messageId, deep, fresh, depth })
  }

  /** Scan user-selected text for a glossary term (local only, zero cost). */
  @Remote
  select(sentence: string): SelectResult {
    return { hit: this.deps.select(String(sentence || '').slice(0, 400)) }
  }

  /** Return the four pet SVG frames as data URLs. */
  @Remote
  pet(): Promise<PetResult> {
    return this.deps.pet()
  }

  /** Return the most recent scanned hit set for the current message. */
  @Remote
  latest(): LatestResult | null {
    return this.deps.latest()
  }

  /** Health probe (lexicon size, model route, sequence). */
  @Remote
  health(): HealthResult {
    return this.deps.health()
  }
}
