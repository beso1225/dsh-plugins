import type { BadgeRule, Config } from './config.ts'

/**
 * Rules reproducing the shipped DeepSeek 1017 badge. The built-in label plugin
 * is shadowed at the slot, so these routes must keep their marker here.
 */
export const DEEPSEEK_1017_RULES: readonly BadgeRule[] = [
  {
    provider: 'deepseek-official',
    model: 'deepseek-flash',
    name: 'DeepSeek-V4.1-Flash',
    label: '1017',
    tone: 'info',
  },
  {
    provider: 'deepseek-account',
    model: 'deepseek-flash',
    name: 'DeepSeek-V4.1-Flash',
    label: '1017',
    tone: 'info',
  },
  {
    provider: 'ollama-cloud',
    model: 'deepseek-v4.1-flash:1017',
    name: 'DeepSeek-V4.1-Flash',
    label: '1017',
    tone: 'info',
  },
]

/**
 * Defaults shared by the Host schema and the browser fallback. The OpenCode Go
 * route is the repository owner's pinned Flash build; edit `badges` in the
 * profile patch when that route serves a different build.
 */
export const DEFAULT_CONFIG: Readonly<Config> = {
  showProvider: true,
  presets: ['deepseek-1017'],
  badges: [{ provider: 'opencode-go', model: 'deepseek-v4.1-flash', label: '1017', tone: 'info' }],
}
