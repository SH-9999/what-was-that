/**
 * Single-file client + ESM host build for what-was-that.
 *
 * Host = plain ESM for Node, externalizing @deepseek-ai/dsh-* + cordis.
 * Client = one CJS bundle wrapped in the ModuleLoader factory handshake,
 * externalizing react + @deepseek-ai/dsh-* (provided by the app/module system).
 */
import { build } from 'esbuild'
import { mkdirSync, cpSync } from 'node:fs'

mkdirSync('lib', { recursive: true })

const dshExternal = ['@deepseek-ai/cordis', '@deepseek-ai/dsh-*']

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: ['node22'],
  sourcemap: true,
  external: dshExternal,
  logLevel: 'info',
})

await build({
  entryPoints: ['src/client/index.ts'],
  outfile: 'lib/client.js',
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  sourcemap: true,
  jsx: 'automatic',
  external: [...dshExternal, 'react', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  banner: {
    js: "window.__ModuleLoader__.load({ id: 'what-was-that', factory: (require) => { var module = { exports: {} }; var exports = module.exports;",
  },
  footer: {
    js: 'return module.exports; } });',
  },
  logLevel: 'info',
})

// Copy pet assets (transparent SVGs) so they ship with the package and can be
// re-bundled/read at runtime. Keep them in lib/assets.
cpSync('assets', 'lib/assets', { recursive: true })
console.log('copied assets -> lib/assets')
