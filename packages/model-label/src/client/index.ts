/** Browser half: one provider-aware label for the composer model seat. */
import { createElement } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only imports pull the slot declaration and the ctx.slots service merge.
import type {} from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { Config } from '../config.ts'
import { resolveConfig } from '../label.ts'
import { ModelLabel } from './ModelLabel.tsx'

/** Full slot props for the composer model label. */
export type ModelLabelOwner = PropsRuntime<'conversation.input.model.label'>

/** Services required by this plugin. */
export const inject = ['slots']

/**
 * Register the label one priority below the shipped 1017 badge. The built-in
 * plugin stays installed as the fallback; disabling this bundle restores it.
 * @param ctx - Client plugin context that owns the registration.
 * @param config - Validated row configuration.
 */
export function apply(ctx: Context, config: Config): void {
  const resolved = resolveConfig(config)
  ctx.slots.inject('conversation.input.model.label', () =>
    ctx.slots.register(
      {
        name: 'conversation.input.model.label',
        priority: -1,
      },
      (props: ModelLabelOwner) =>
        createElement(ModelLabel, {
          provider: props.provider,
          model: props.model,
          placement: props.placement,
          config: resolved,
        }),
    ),
  )
}
