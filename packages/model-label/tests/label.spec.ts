import { describe, expect, it } from 'vitest'
import type { Config } from '../src/config.ts'
import { DEFAULT_CONFIG } from '../src/defaults.ts'
import { resolveConfig, resolveLabel, type LabelInput } from '../src/label.ts'

const official: LabelInput = {
  provider: { id: 'deepseek-official', name: 'DeepSeek' },
  model: { id: 'deepseek-flash', name: 'DeepSeek-V4.1-Flash' },
  placement: 'trigger',
}

const opencodeGo: LabelInput = {
  provider: { id: 'opencode-go', name: 'OpenCode Go' },
  model: { id: 'deepseek-v4.1-flash', name: 'DeepSeek-V4.1-Flash' },
  placement: 'trigger',
}

describe('resolveLabel', () => {
  it('shows the provider and the built-in 1017 badge on the official route', () => {
    expect(resolveLabel(official, DEFAULT_CONFIG)).toEqual({
      providerName: 'DeepSeek',
      modelName: 'DeepSeek-V4.1-Flash',
      badge: { label: '1017', tone: 'info' },
    })
  })

  it('labels OpenCode Go through the default badge rule', () => {
    expect(resolveLabel(opencodeGo, DEFAULT_CONFIG)).toEqual({
      providerName: 'OpenCode Go',
      modelName: 'DeepSeek-V4.1-Flash',
      badge: { label: '1017', tone: 'info' },
    })
  })

  it('keeps the provider out of option rows', () => {
    expect(resolveLabel({ ...official, placement: 'option' }, DEFAULT_CONFIG)).toEqual({
      modelName: 'DeepSeek-V4.1-Flash',
      badge: { label: '1017', tone: 'info' },
    })
  })

  it('shows the provider in the root-menu value', () => {
    expect(resolveLabel({ ...official, placement: 'menu' }, DEFAULT_CONFIG).providerName).toBe(
      'DeepSeek',
    )
  })

  it('drops the provider when showProvider is false', () => {
    expect(resolveLabel(official, { ...DEFAULT_CONFIG, showProvider: false }).providerName).toBe(
      undefined,
    )
  })

  it('returns the catalog name untouched when no rule matches', () => {
    expect(
      resolveLabel(
        {
          provider: { id: 'ollama-local', name: 'Ollama Local' },
          model: { id: 'qwen3.5:4b', name: 'Qwen 3.5 4B' },
          placement: 'trigger',
        },
        DEFAULT_CONFIG,
      ),
    ).toEqual({ providerName: 'Ollama Local', modelName: 'Qwen 3.5 4B' })
  })

  it('honors the optional catalog-name guard', () => {
    const config: Config = {
      ...DEFAULT_CONFIG,
      presets: [],
      badges: [
        {
          provider: 'opencode-go',
          model: 'deepseek-v4.1-flash',
          name: 'A different build',
          label: 'other',
        },
      ],
    }
    expect(resolveLabel(opencodeGo, config).badge).toBe(undefined)
  })

  it('prefers explicit badges over presets', () => {
    const config: Config = {
      ...DEFAULT_CONFIG,
      badges: [{ provider: 'deepseek-official', model: 'deepseek-flash', label: 'custom' }],
    }
    expect(resolveLabel(official, config).badge).toEqual({ label: 'custom', tone: 'info' })
  })

  it('drops the built-in badge when presets are disabled', () => {
    expect(resolveLabel(official, { ...DEFAULT_CONFIG, presets: [] }).badge).toBe(undefined)
  })

  it('fills partial configuration from the defaults', () => {
    expect(resolveConfig({ showProvider: false })).toEqual({
      ...DEFAULT_CONFIG,
      showProvider: false,
    })
  })
})
