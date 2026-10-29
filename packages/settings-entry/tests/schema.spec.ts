import { describe, expect, it } from 'vitest'
import { Config } from '../src/schema.ts'

describe('Config schema', () => {
  it('fills every default for an empty row config', () => {
    const config = Config({})
    expect(config.showLabel).toBe(true)
    expect(config.label).toBe('Settings')
  })

  it('keeps the label when only visibility changes', () => {
    const config = Config({ showLabel: false })
    expect(config.showLabel).toBe(false)
    expect(config.label).toBe('Settings')
  })

  const parseUnknown = (input: unknown): unknown =>
    (Config as unknown as (value: unknown) => unknown)(input)

  it('rejects an empty label', () => {
    expect(() => parseUnknown({ label: '' })).toThrow()
  })
})
