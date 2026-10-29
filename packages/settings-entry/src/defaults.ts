import type { Config } from './config.ts'

/** Slot cell key for this row inside `sidebar.footer.action`. */
export const ROW_ID = 'settings-entry'

/**
 * Sort before the shipped footer actions. The Cordis panel registers at the
 * default order 0, so a negative order keeps Settings first in the row.
 */
export const ROW_ORDER = -10

/** Command the shipped settings shell registers for its dialog. */
export const SETTINGS_COMMAND_ID = 'settings.open'

/**
 * Defaults shared by the Host schema and the browser fallback. The label
 * matches the shipped sidebar trigger so the extra control reads as the same
 * Settings seat.
 */
export const DEFAULT_CONFIG: Readonly<Config> = {
  showLabel: true,
  label: 'Settings',
}
