import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import { apply } from '../src/client/index.ts'
import { DEFAULT_CONFIG } from '../src/defaults.ts'

interface Registration {
  options: { name: string; priority?: number }
  component: (props: unknown) => ReactElement
}

describe('client entry', () => {
  it('registers the label one priority below the shipped occupant', () => {
    let registration: Registration | undefined
    const ctx = {
      slots: {
        inject: (name: string, callback: () => unknown) => {
          expect(name).toBe('conversation.input.model.label')
          return callback()
        },
        register: (options: Registration['options'], component: Registration['component']) => {
          registration = { options, component }
          return () => {}
        },
      },
    } as unknown as Context

    apply(ctx, DEFAULT_CONFIG)

    expect(registration?.options).toEqual({
      name: 'conversation.input.model.label',
      priority: -1,
    })

    const html = renderToStaticMarkup(
      registration!.component({
        provider: { id: 'opencode-go', name: 'OpenCode Go' },
        model: { id: 'deepseek-v4.1-flash', name: 'DeepSeek-V4.1-Flash' },
        placement: 'trigger',
        selected: true,
      }),
    )
    expect(html).toContain('OpenCode Go')
    expect(html).toContain('DeepSeek-V4.1-Flash')
    expect(html).toContain('1017')
  })
})
