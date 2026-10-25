import type { BadgeRule, BadgeTone, Config } from './config.ts'
import { DEFAULT_CONFIG } from './defaults.ts'
import { PRESETS } from './presets.ts'

/** Minimal catalog slice needed to choose a label. */
export interface LabelModel {
  readonly id: string
  readonly name: string
}

/** Minimal provider slice needed to choose a label. */
export interface LabelProvider {
  readonly id: string
  readonly name: string
}

/** Where the label is rendered. */
export type LabelPlacement = 'trigger' | 'menu' | 'option'

/** Inputs from the slot owner. */
export interface LabelInput {
  readonly provider: LabelProvider
  readonly model: LabelModel
  readonly placement: LabelPlacement
}

/** What the component should render. */
export interface ResolvedLabel {
  /** Provider prefix; absent in option rows. */
  readonly providerName?: string
  /** Catalog model name, unchanged. */
  readonly modelName: string
  /** Matching badge; absent when no rule applies. */
  readonly badge?: {
    readonly label: string
    readonly tone: BadgeTone
  }
}

/** Whether a rule names this exact provider/model (and optional catalog name). */
function matches(rule: BadgeRule, input: LabelInput): boolean {
  return (
    rule.provider === input.provider.id &&
    rule.model === input.model.id &&
    (rule.name === undefined || rule.name === input.model.name)
  )
}

/** First matching explicit rule, then the enabled presets in declaration order. */
function findBadge(config: Config, input: LabelInput): BadgeRule | undefined {
  for (const rule of config.badges ?? []) {
    if (matches(rule, input)) return rule
  }
  for (const preset of config.presets ?? []) {
    for (const rule of PRESETS[preset] ?? []) {
      if (matches(rule, input)) return rule
    }
  }
  return undefined
}

/**
 * Resolve the slot component's output from owner props and row configuration.
 * Pure so the matching rules are testable without React.
 * @param input - provider, model, and placement from the slot owner.
 * @param config - the validated row configuration.
 * @returns the provider prefix, catalog name, and any matching badge.
 */
export function resolveLabel(input: LabelInput, config: Config): ResolvedLabel {
  const badge = findBadge(config, input)
  const showProvider =
    config.showProvider && input.placement !== 'option' && input.provider.name.trim() !== ''
  return {
    ...(showProvider ? { providerName: input.provider.name } : {}),
    modelName: input.model.name,
    ...(badge === undefined || badge.label.trim() === ''
      ? {}
      : { badge: { label: badge.label, tone: badge.tone ?? 'info' } }),
  }
}

/**
 * Fill defaults for a partially provided config. The Host validates and
 * defaults the row config; this fallback keeps a direct client activation safe.
 * @param partial - optional raw config supplied to the client half.
 * @returns a complete configuration object.
 */
export function resolveConfig(partial?: Partial<Config>): Config {
  return {
    showProvider: partial?.showProvider ?? DEFAULT_CONFIG.showProvider,
    presets: partial?.presets ?? [...DEFAULT_CONFIG.presets],
    badges: partial?.badges ?? [...DEFAULT_CONFIG.badges],
  }
}
