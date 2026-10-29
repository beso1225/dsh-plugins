import z from '@deepseek-ai/schemastery'
import type { Config as SettingsEntryConfig } from './config.ts'
import { DEFAULT_CONFIG } from './defaults.ts'

/** Validated configuration for this plugin's row. */
export const Config: z<Partial<SettingsEntryConfig>, SettingsEntryConfig> = z.object({
  showLabel: z.boolean().default(DEFAULT_CONFIG.showLabel),
  label: z.string().min(1).default(DEFAULT_CONFIG.label),
})
