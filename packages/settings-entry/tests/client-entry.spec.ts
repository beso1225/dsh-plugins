import { createElement, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import { apply } from '../src/client/index.ts'
import { DEFAULT_CONFIG, ROW_ID, ROW_ORDER } from '../src/defaults.ts'

interface Registration {
  options: {
    name: string
    id?: string
    order?: number
    inject?: () => Record<string, unknown>
  }
  component: (props: Record<string, unknown>) => ReactElement | null
}

describe('client entry', () => {
  it('adds one footer cell that opens the shipped settings command', () => {
    const invoke = vi.fn()
    let registration: Registration | undefined
    const ctx = {
      get: (name: string) => (name === 'shortcuts' ? { registry: { invoke } } : undefined),
      slots: {
        inject: (name: string, callback: () => unknown) => {
          expect(name).toBe('sidebar.footer.action')
          return callback()
        },
        register: (options: Registration['options'], component: Registration['component']) => {
          registration = { options, component }
          return () => {}
        },
      },
    } as unknown as Context

    apply(ctx, DEFAULT_CONFIG)

    expect(registration?.options.name).toBe('sidebar.footer.action')
    expect(registration?.options.id).toBe(ROW_ID)
    expect(registration?.options.order).toBe(ROW_ORDER)

    const face = registration!.options.inject!()
    expect(face.available).toBe(true)
    expect(face.config).toEqual(DEFAULT_CONFIG)

    const enterSettings = face.enterSettings as () => boolean
    expect(enterSettings()).toBe(true)
    expect(invoke).toHaveBeenCalledWith('settings.open', { modal: null })

    const html = renderToStaticMarkup(
      createElement(registration!.component as (props: Record<string, unknown>) => ReactElement, {
        wide: true,
        ...face,
      }),
    )
    expect(html).toContain('data-settings-entry="wide"')
    expect(html).toContain('>Settings</span>')
  })

  it('keeps the cell inert when the shortcuts service is absent', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    let registration: Registration | undefined
    const ctx = {
      get: () => undefined,
      slots: {
        inject: (_name: string, callback: () => unknown) => callback(),
        register: (options: Registration['options'], component: Registration['component']) => {
          registration = { options, component }
          return () => {}
        },
      },
    } as unknown as Context

    apply(ctx, DEFAULT_CONFIG)

    const face = registration!.options.inject!()
    expect(face.available).toBe(false)
    expect((face.enterSettings as () => boolean)()).toBe(false)
    expect(
      renderToStaticMarkup(
        createElement(registration!.component as (props: Record<string, unknown>) => ReactElement, {
          wide: true,
          ...face,
        }),
      ),
    ).toBe('')
    warn.mockRestore()
  })
})
