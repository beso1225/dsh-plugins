/** Browser half: one direct Settings control in the sidebar foot. */
import type { Context } from '@deepseek-ai/cordis'
// Type-only imports pull the ctx.slots service merge and the slot declaration.
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { Config } from '../config.ts'
import { ROW_ID, ROW_ORDER } from '../defaults.ts'
import { createSettingsOpener, type ShortcutsPort } from '../open.ts'
import { resolveConfig } from '../row.ts'
import { SettingsEntryRow } from './SettingsEntryRow.tsx'

/** Services required by this plugin. */
export const inject = ['slots', 'shortcuts']

/**
 * Register one additive cell in the sidebar foot list. The shipped account
 * launcher keeps its own `settings.launcher` seat, so this row adds a direct
 * Settings entry instead of replacing anything.
 * @param ctx - Client plugin context that owns the registration.
 * @param config - Validated row configuration.
 */
export function apply(ctx: Context, config: Config): void {
  const resolved = resolveConfig(config)
  const shortcuts = ctx.get('shortcuts') as unknown as ShortcutsPort | undefined
  const opener = createSettingsOpener(shortcuts)
  ctx.slots.inject('sidebar.footer.action', () =>
    ctx.slots.register(
      {
        name: 'sidebar.footer.action',
        id: ROW_ID,
        order: ROW_ORDER,
        inject: () => ({
          config: resolved,
          enterSettings: opener.open,
          available: opener.available,
        }),
      },
      SettingsEntryRow,
    ),
  )
}
