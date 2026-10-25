/** Public configuration model for provider-aware labels and release badges. */

/** Badge palette names mirrored by the component's own capsule. */
export type BadgeTone =
  'outline' | 'solid' | 'neutral' | 'quiet' | 'success' | 'info' | 'warning' | 'danger'

/** One build label applied to a provider/model pair. */
export interface BadgeRule {
  /** Provider id from the model catalog. */
  provider: string
  /** Model id from the model catalog. */
  model: string
  /** Optional exact catalog name guard. */
  name?: string
  /** Badge text, for example "1017". */
  label: string
  /** Capsule palette; defaults to "info". */
  tone?: BadgeTone
}

/** Built-in rule groups shipping with the plugin. */
export type PresetId = 'deepseek-1017'

/** Plugin row configuration. */
export interface Config {
  /** Prefix the provider display name in the trigger and root menu. */
  showProvider: boolean
  /** Built-in rule groups to evaluate after explicit badges. */
  presets: PresetId[]
  /** Additional rules; the first matching rule wins. */
  badges: BadgeRule[]
}
