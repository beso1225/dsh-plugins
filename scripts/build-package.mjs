#!/usr/bin/env node
/**
 * Build one plugin package:
 * - TypeScript declarations for `types` and the `./client` export
 * - the Host entry as ESM
 * - the browser entry wrapped in the module loader's closure factory
 *
 * Run from the package directory: `node ../../scripts/build-package.mjs`.
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const packageDir = process.cwd()
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await readFile(resolve(packageDir, 'package.json'), 'utf8'))
const name = manifest.name

if (typeof name !== 'string' || name.length === 0) {
  throw new Error('build-package: package.json has no name')
}

const tsc = resolve(repoRoot, 'node_modules/typescript/lib/tsc.js')
if (!existsSync(tsc)) throw new Error(`build-package: tsc not found at ${tsc}`)

await rm(resolve(packageDir, 'lib'), { recursive: true, force: true })
execFileSync(process.execPath, [tsc, '-p', 'tsconfig.build.json'], {
  cwd: packageDir,
  stdio: 'inherit',
})

await build({
  absWorkingDir: packageDir,
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  packages: 'external',
  sourcemap: true,
  logLevel: 'info',
})

if (manifest.dsh?.client !== undefined) {
  const clientEntry = ['src/client/index.ts', 'src/client/index.tsx'].find((file) =>
    existsSync(resolve(packageDir, file)),
  )
  if (clientEntry === undefined) {
    throw new Error(`${name}: dsh.client is declared but src/client/index.ts(x) is missing`)
  }

  const banner = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(name)},
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });`
  const footer = `    return module.exports;
  },
});`

  await build({
    absWorkingDir: packageDir,
    entryPoints: [clientEntry],
    outfile: 'lib/client.js',
    bundle: true,
    platform: 'browser',
    format: 'cjs',
    target: 'es2022',
    jsx: 'automatic',
    external: ['react', 'react-dom', 'react/jsx-runtime', '@deepseek-ai/*'],
    banner: { js: banner },
    footer: { js: footer },
    sourcemap: true,
    logLevel: 'info',
  })
}

console.log(`build-package: ${name} built`)
