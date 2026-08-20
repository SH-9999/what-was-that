/**
 * The hand-written host Typert manifest for the wwt Remote. Registered through
 * `ctx.typert.register` in the plugin body, it claims the `wwt/*` wire
 * endpoints through the strict registry — the same path generated artifacts
 * use — so the Host Gateway resolves them without consulting the `@Remote`
 * marker table (which, in the harness's source-launch dev environment, is a
 * different module instance than the profile-loaded plugin bundle's).
 */
import type { TypertContribution } from '@deepseek-ai/dsh-typert-registry/types'
import { WWT_INVOCATIONS } from './contract.js'

/** The `wwt` namespace's host manifest. */
export const WWT_MANIFEST: TypertContribution = {
  package: 'what-was-that',
  face: 'host',
  schemas: [],
  model: {
    services: [
      {
        key: 'wwt',
        exportName: 'WwtRuntime',
        description: 'Plain-language explanations for AI jargon.',
        tags: [],
        members: [
          {
            kind: 'method',
            name: 'explain',
            signature: 'explain(term: string, messageId: string, deep: boolean, fresh: boolean, depth: number): Promise<ExplainResult>',
          },
          { kind: 'method', name: 'select', signature: 'select(sentence: string): SelectResult' },
          { kind: 'method', name: 'pet', signature: 'pet(): Promise<PetResult>' },
          { kind: 'method', name: 'latest', signature: 'latest(): LatestResult | null' },
          { kind: 'method', name: 'health', signature: 'health(): HealthResult' },
        ],
        types: [],
      },
    ],
    events: [],
    objects: [],
  },
  invocations: WWT_INVOCATIONS,
}
