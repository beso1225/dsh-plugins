import { SETTINGS_COMMAND_ID } from './defaults.ts'

/** Context the shipped settings command resolves; no modal covers the frame. */
export interface SettingsCommandContext {
  readonly modal: string | null
}

/** Minimal face of the client command registry that carries the settings command. */
export interface SettingsCommandRegistry {
  invoke(commandId: string, context: SettingsCommandContext): void
}

/** Minimal face of the client shortcuts service the shipped shell registers with. */
export interface ShortcutsPort {
  readonly registry?: SettingsCommandRegistry | undefined
}

/** Wiring between the sidebar row and the shipped settings command. */
export interface SettingsOpener {
  /** Whether a command registry that can run the settings command exists. */
  readonly available: boolean
  /** Ask the shipped settings shell to open its dialog. */
  open(): boolean
}

/**
 * Bind the entry to the command the shipped settings shell registers.
 *
 * The `settings.launcher` slot is the only seat that hands a plugin the
 * shell's own open callback, and the shipped account menu occupies it. This
 * row therefore routes through the same command entry point the native menu
 * and the Settings shortcut use, which keeps the account menu intact.
 * @param shortcuts - the client shortcuts service, when the composition has one.
 * @returns an opener that reports whether the command path is reachable.
 */
export function createSettingsOpener(shortcuts: ShortcutsPort | undefined): SettingsOpener {
  const registry = shortcuts?.registry
  const invoke =
    typeof registry?.invoke === 'function'
      ? (id: string, context: SettingsCommandContext) => registry.invoke(id, context)
      : undefined
  let warned = false
  return {
    available: invoke !== undefined,
    open() {
      if (invoke === undefined) {
        if (!warned) {
          warned = true
          console.warn(
            'settings-entry: the shortcuts service exposes no command registry, so the Settings dialog cannot be opened from the sidebar.',
          )
        }
        return false
      }
      try {
        invoke(SETTINGS_COMMAND_ID, { modal: null })
        return true
      } catch (error) {
        if (!warned) {
          warned = true
          console.warn('settings-entry: the settings command failed to run.', error)
        }
        return false
      }
    },
  }
}
