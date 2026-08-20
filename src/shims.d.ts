/**
 * Minimal ambient type shims for the peer packages this static plugin talks
 * to at runtime. These are TypeScript-only (`*.d.ts`, never emitted, ignored
 * by esbuild): the real `@deepseek-ai/*` packages are externalized in the
 * bundle and resolved from the profile's hoisted node_modules at runtime.
 *
 * Declared here so typecheck passes without installing the full type packages
 * as dependencies — consistent with the plugin's loose-`any` / minimal-deps
 * style. Keep this surface to exactly what the plugin uses.
 */

declare module '@deepseek-ai/cordis' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Context {}
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  export const Remote: any
  export class TypertRemoteService {
    constructor(ctx: any, namespace: string)
  }
  export interface InvocationParameterDescriptor {
    name: string
    wire: string
    source: 'json' | 'lookup'
    lookup?: string
    codec: { mode: 'strict'; typeSymbol: string; schema: { parse(value: unknown): unknown } } | { mode: 'src-json' }
  }
  export interface InvocationDescriptor {
    id: string
    service: string
    namespace: string
    method: string
    invocation: { kind: 'direct' }
    parameters: readonly InvocationParameterDescriptor[]
    cancellation?: { parameter: 'signal' }
    result: { mode: 'strict'; typeSymbol: string; schema: { parse(value: unknown): unknown } } | { mode: 'src-json' }
  }
  export type RemoteResult<T> =
    | { ok: true; value: T }
    | { ok: false; error: { code: string; message: string; details: object } }
  export interface TypertRemoteContribution {
    package: string
    descriptors: readonly InvocationDescriptor[]
  }
}

declare module '@deepseek-ai/dsh-typert-registry' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Context {}
}

declare module '@deepseek-ai/dsh-typert-registry/types' {
  import type { InvocationDescriptor } from '@deepseek-ai/dsh-typert-protocol'
  export interface TypertContribution {
    package: string
    face: 'host'
    schemas: readonly unknown[]
    model: {
      services: readonly Array<{
        key: string
        exportName: string
        description: string
        tags: readonly string[]
        members: readonly Array<{ kind: 'method'; name: string; signature: string }>
        types: readonly unknown[]
      }>
      events: readonly unknown[]
      objects: readonly unknown[]
    }
    invocations: readonly InvocationDescriptor[]
  }
}
