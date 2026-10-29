import { describe, expect, it, vi } from 'vitest'
import type { SettingsCommandRegistry } from '../src/open.ts'
import { createSettingsOpener } from '../src/open.ts'

describe('createSettingsOpener', () => {
  it('reports unavailable when the composition has no shortcuts service', () => {
    const opener = createSettingsOpener(undefined)
    expect(opener.available).toBe(false)
    expect(opener.open()).toBe(false)
  })

  it('reports unavailable when the service exposes no command registry', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const opener = createSettingsOpener({})

    expect(opener.available).toBe(false)
    expect(opener.open()).toBe(false)
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('runs the shipped settings command with no blocking modal', () => {
    const invoke = vi.fn()
    const opener = createSettingsOpener({ registry: { invoke } })

    expect(opener.available).toBe(true)
    expect(opener.open()).toBe(true)
    expect(invoke).toHaveBeenCalledTimes(1)
    expect(invoke).toHaveBeenCalledWith('settings.open', { modal: null })
  })

  it('keeps a failing command from escaping the click handler', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const registry: SettingsCommandRegistry = {
      invoke: () => {
        throw new Error('command unavailable')
      },
    }
    const opener = createSettingsOpener({ registry })

    expect(opener.open()).toBe(false)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(opener.open()).toBe(false)
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('treats a registry without a callable invoke as unavailable', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const opener = createSettingsOpener({ registry: {} as SettingsCommandRegistry })

    expect(opener.available).toBe(false)
    expect(opener.open()).toBe(false)
    warn.mockRestore()
  })
})
