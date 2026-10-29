import type { Config } from './config.ts'
import { DEFAULT_CONFIG } from './defaults.ts'

/**
 * Fill defaults for a partially provided config. The Host validates and
 * defaults the row config; this fallback keeps a direct client activation safe.
 * @param partial - optional raw config supplied to the client half.
 * @returns a complete configuration object.
 */
export function resolveConfig(partial?: Partial<Config>): Config {
  return {
    showLabel: partial?.showLabel ?? DEFAULT_CONFIG.showLabel,
    label: partial?.label ?? DEFAULT_CONFIG.label,
  }
}

/**
 * Visible label for the current column width. The rail keeps the icon only, so
 * the accessible name always comes from the configured label.
 * @param config - the validated row configuration.
 * @param wide - whether the sidebar renders wide content instead of the rail.
 * @returns the label text, or undefined for an icon-only control.
 */
export function resolveRowLabel(config: Config, wide: boolean): string | undefined {
  if (!wide || !config.showLabel) return undefined
  const label = config.label.trim()
  return label === '' ? undefined : label
}
