#!/usr/bin/env node
/**
 * Verify one package's built artifacts, display resources, and npm file list.
 * Run from the package directory: `node ../../scripts/check-package.mjs`.
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const packageDir = process.cwd()
const manifest = JSON.parse(await readFile(resolve(packageDir, 'package.json'), 'utf8'))
const name = manifest.name
const errors = []

const requireFile = (relative, label = relative) => {
  if (!existsSync(resolve(packageDir, relative))) errors.push(`missing ${label}`)
}

requireFile('lib/index.js')
requireFile('lib/types/index.d.ts')
requireFile('cordis.patch.yml')

if (manifest.dsh?.client !== undefined) {
  requireFile('lib/client.js')
  requireFile('lib/types/client/index.d.ts')
  const clientPath = resolve(packageDir, 'lib/client.js')
  if (existsSync(clientPath)) {
    const client = await readFile(clientPath, 'utf8')
    if (!client.includes('window.__ModuleLoader__.load(')) {
      errors.push('lib/client.js is not wrapped for window.__ModuleLoader__')
    }
    if (!client.includes(`id: ${JSON.stringify(name)}`)) {
      errors.push('lib/client.js module id does not match the package name')
    }
  }
}

for (const locale of ['locale/en.json', 'locale/ja.json']) {
  const path = resolve(packageDir, locale)
  if (!existsSync(path)) {
    errors.push(`missing ${locale}`)
    continue
  }
  const json = JSON.parse(await readFile(path, 'utf8'))
  if (typeof json.meta?.title !== 'string' || typeof json.meta?.description !== 'string') {
    errors.push(`${locale} needs meta.title and meta.description`)
  }
}

const icon = resolve(packageDir, 'icon.svg')
if (!existsSync(icon)) {
  errors.push('missing icon.svg')
} else {
  const info = await stat(icon)
  if (info.size > 256 * 1024) errors.push('icon.svg exceeds 256 KiB')
  const text = await readFile(icon, 'utf8')
  if (!text.trimStart().startsWith('<svg')) errors.push('icon.svg is not an SVG document')
}

if (errors.length === 0) {
  // The user's global npm cache can be unwritable. Pack into an owned temp
  // cache so this check needs no home-directory writes.
  const cache = await mkdtemp(join(tmpdir(), 'dsh-plugins-pack-'))
  try {
    const packed = JSON.parse(
      execFileSync('npm', ['pack', '--dry-run', '--json', '--cache', cache], {
        cwd: packageDir,
        encoding: 'utf8',
        env: { ...process.env, npm_config_cache: cache },
      }),
    )
    const files = new Set(packed[0]?.files?.map((file) => file.path) ?? [])
    for (const required of [
      'lib/index.js',
      'lib/client.js',
      'cordis.patch.yml',
      'icon.svg',
      'locale/en.json',
      'locale/ja.json',
    ]) {
      if (!files.has(required)) errors.push(`npm pack omits ${required}`)
    }
  } catch (error) {
    errors.push(`npm pack failed: ${error instanceof Error ? error.message : String(error)}`)
  } finally {
    await rm(cache, { recursive: true, force: true })
  }
}

if (errors.length > 0) {
  console.error(`check-package: ${name}\n- ${errors.join('\n- ')}`)
  process.exitCode = 1
} else {
  console.log(`check-package: ${name} ok`)
}
