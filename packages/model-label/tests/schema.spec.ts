import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from '../src/defaults.ts'
import { Config } from '../src/schema.ts'

describe('Config schema', () => {
  it('fills every default for an empty row config', () => {
    const config = Config({})
    expect(config.showProvider).toBe(true)
    expect(config.presets).toEqual(['deepseek-1017'])
    expect(config.badges).toEqual(DEFAULT_CONFIG.badges)
  })

  it('keeps the presets when only badges are overridden', () => {
    const config = Config({
      badges: [{ provider: 'opencode-go', model: 'deepseek-v4.1-flash', label: '1017' }],
    })
    expect(config.showProvider).toBe(true)
    expect(config.presets).toEqual(['deepseek-1017'])
    expect(config.badges?.[0]?.tone).toBe('info')
  })

  it('allows disabling the provider prefix independently', () => {
    const config = Config({ showProvider: false })
    expect(config.showProvider).toBe(false)
    expect(config.presets).toEqual(['deepseek-1017'])
  })

  const parseUnknown = (input: unknown): unknown =>
    (Config as unknown as (value: unknown) => unknown)(input)

  it('rejects unknown presets and badge tones', () => {
    expect(() => parseUnknown({ presets: ['unknown'] })).toThrow()
    expect(() =>
      parseUnknown({
        badges: [{ provider: 'x', model: 'y', label: 'z', tone: 'bogus' }],
      }),
    ).toThrow()
  })

  it('requires badge identity fields', () => {
    expect(() => parseUnknown({ badges: [{ provider: 'x', model: 'y' }] })).toThrow()
  })
})
