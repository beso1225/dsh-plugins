import type { BadgeRule, PresetId } from './config.ts'
import { DEEPSEEK_1017_RULES } from './defaults.ts'

/** Built-in rule groups keyed by preset id. */
export const PRESETS: Readonly<Record<PresetId, readonly BadgeRule[]>> = {
  'deepseek-1017': DEEPSEEK_1017_RULES,
}

/** Preset ids accepted by the configuration schema. */
export const PRESET_IDS: readonly PresetId[] = ['deepseek-1017']
