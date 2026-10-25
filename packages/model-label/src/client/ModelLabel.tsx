/** Provider-aware model label with an optional release badge. */
import type { CSSProperties } from 'react'
import type { BadgeTone, Config } from '../config.ts'
import { resolveLabel, type LabelModel, type LabelPlacement, type LabelProvider } from '../label.ts'

/** Presentational props for one label instance. */
export interface ModelLabelProps {
  readonly provider: LabelProvider
  readonly model: LabelModel
  readonly placement: LabelPlacement
  readonly config: Config
}

/** Inline layout shared by every label; text spaces keep copy and speech readable. */
const LABEL_STYLE: CSSProperties = {
  whiteSpace: 'nowrap',
  verticalAlign: 'baseline',
}

/** Provider and separator share the caption tone. */
const PROVIDER_STYLE: CSSProperties = { color: 'var(--dsw-alias-label-secondary)' }
const SEPARATOR_STYLE: CSSProperties = { color: 'var(--dsw-alias-label-secondary)' }

/**
 * Capsule geometry copied from the host Tag primitive (11px/17px, 1px by 8px,
 * 500 weight, fully rounded) so the badge reads as the shipped 1017 marker.
 */
const BADGE_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 999,
  padding: '1px 8px',
  fontSize: 11,
  lineHeight: '17px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

/**
 * Palettes use only the theme tokens the live Theme provider lists. `info`
 * borrows the brand token; the shipped Tag's unlisted business token is not
 * part of the public token set.
 */
const TONE_STYLES: Readonly<Record<BadgeTone, CSSProperties>> = {
  outline: {
    border: '0.5px solid var(--dsw-alias-border-l2)',
    color: 'var(--dsw-alias-label-secondary)',
  },
  solid: {
    background: 'var(--dsw-alias-label-primary)',
    color: 'var(--dsw-alias-bg-base)',
  },
  neutral: {
    background: 'var(--dsw-alias-bg-layer-2)',
    color: 'var(--dsw-alias-label-secondary)',
  },
  quiet: { color: 'var(--dsw-alias-label-secondary)' },
  success: {
    background: 'color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent)',
    color: 'var(--dsw-alias-state-success-primary)',
  },
  info: {
    background: 'color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent)',
    color: 'var(--dsw-alias-brand-primary)',
  },
  warning: {
    background: 'color-mix(in srgb, var(--dsw-alias-state-warn-primary) 12%, transparent)',
    color: 'var(--dsw-alias-state-warn-primary)',
  },
  danger: {
    background: 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent)',
    color: 'var(--dsw-alias-state-error-primary)',
  },
}

/**
 * Render the provider prefix, catalog model name, and any configured badge.
 * @param props - owner props plus the validated configuration.
 * @returns inline label content, or the untouched catalog name.
 */
export function ModelLabel({ provider, model, placement, config }: ModelLabelProps) {
  const resolved = resolveLabel({ provider, model, placement }, config)
  if (resolved.providerName === undefined && resolved.badge === undefined) return resolved.modelName
  return (
    <span style={LABEL_STYLE}>
      {resolved.providerName !== undefined && (
        <>
          <span style={PROVIDER_STYLE}>{resolved.providerName}</span>{' '}
          <span aria-hidden="true" style={SEPARATOR_STYLE}>
            ·
          </span>{' '}
        </>
      )}
      <span>{resolved.modelName}</span>
      {resolved.badge !== undefined && (
        <>
          {' '}
          <span
            data-tone={resolved.badge.tone}
            style={{ ...BADGE_STYLE, ...TONE_STYLES[resolved.badge.tone] }}
          >
            {resolved.badge.label}
          </span>
        </>
      )}
    </span>
  )
}
