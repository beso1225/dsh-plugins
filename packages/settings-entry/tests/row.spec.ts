import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG, ROW_ID, ROW_ORDER, SETTINGS_COMMAND_ID } from '../src/defaults.ts'
import { resolveConfig, resolveRowLabel } from '../src/row.ts'

describe('resolveConfig', () => {
  it('fills every default for a partially provided config', () => {
    expect(resolveConfig(undefined)).toEqual(DEFAULT_CONFIG)
    expect(resolveConfig({})).toEqual(DEFAULT_CONFIG)
    expect(DEFAULT_CONFIG.showLabel).toBe(true)
    expect(DEFAULT_CONFIG.label).toBe('Settings')
  })

  it('keeps an explicit label and visibility choice', () => {
    expect(resolveConfig({ showLabel: false, label: '設定' })).toEqual({
      showLabel: false,
      label: '設定',
    })
  })
})

describe('resolveRowLabel', () => {
  it('renders the configured label in the expanded sidebar', () => {
    expect(resolveRowLabel(DEFAULT_CONFIG, true)).toBe('Settings')
    expect(resolveRowLabel({ showLabel: true, label: '  Preferences  ' }, true)).toBe('Preferences')
  })

  it('keeps the rail icon-only', () => {
    expect(resolveRowLabel(DEFAULT_CONFIG, false)).toBeUndefined()
  })

  it('honors the showLabel switch', () => {
    expect(resolveRowLabel({ showLabel: false, label: 'Settings' }, true)).toBeUndefined()
  })

  it('never renders blank text', () => {
    expect(resolveRowLabel({ showLabel: true, label: '   ' }, true)).toBeUndefined()
  })
})

describe('row defaults', () => {
  it('registers one additive cell before the shipped footer actions', () => {
    expect(ROW_ID).toBe('settings-entry')
    expect(ROW_ORDER).toBeLessThan(0)
  })

  it('targets the command the settings shell registers', () => {
    expect(SETTINGS_COMMAND_ID).toBe('settings.open')
  })
})
