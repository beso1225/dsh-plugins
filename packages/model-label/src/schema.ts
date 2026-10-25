import z from '@deepseek-ai/schemastery'
import type { BadgeTone, Config as ModelLabelConfig } from './config.ts'
import { DEFAULT_CONFIG } from './defaults.ts'
import { PRESET_IDS } from './presets.ts'

/** Every palette the capsule supports. */
const BADGE_TONES = [
  'outline',
  'solid',
  'neutral',
  'quiet',
  'success',
  'info',
  'warning',
  'danger',
] as const satisfies readonly BadgeTone[]

/** Validated configuration for this plugin's row. */
export const Config: z<Partial<ModelLabelConfig>, ModelLabelConfig> = z.object({
  showProvider: z.boolean().default(DEFAULT_CONFIG.showProvider),
  presets: z.array(z.union([...PRESET_IDS])).default([...DEFAULT_CONFIG.presets]),
  badges: z
    .array(
      z.object({
        provider: z.string().min(1).required(),
        model: z.string().min(1).required(),
        name: z.string().min(1),
        label: z.string().min(1).required(),
        tone: z.union([...BADGE_TONES]).default('info'),
      }),
    )
    .default(DEFAULT_CONFIG.badges.map((badge) => ({ ...badge }))),
})
