/**
 * The client-side Typert Remote contribution for the what-was-that host
 * service: mounts the shared `src-json` descriptors into the `wwt` wire
 * namespace. The client resolves the mounted namespace service through
 * `ctx.reflect.get('remote.wwt')`, NOT the dotted `ctx.remote.wwt` read (which
 * walks the cordis fiber chain and stops at the Loader's runtime-less internal
 * forks). See client/index.ts.
 */
import type { RemoteResult, TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol'
import { WWT_INVOCATIONS } from '../contract.js'
import type { ExplainResult, HealthResult, LatestResult, PetResult, SelectResult } from '../contract.js'

/** The `wwt` Remote namespace's client contribution. */
export const WWT_REMOTE: TypertRemoteContribution = {
  package: 'what-was-that',
  descriptors: WWT_INVOCATIONS,
}

/** Callable face of the mounted `wwt` namespace (Resolved via reflect). */
export interface WwtNamespaceFace {
  explain(
    term: string,
    messageId: string,
    deep: boolean,
    fresh: boolean,
    depth: number,
  ): Promise<RemoteResult<ExplainResult>>
  select(sentence: string): Promise<RemoteResult<SelectResult>>
  pet(): Promise<RemoteResult<PetResult>>
  latest(): Promise<RemoteResult<LatestResult | null>>
  health(): Promise<RemoteResult<HealthResult>>
}
