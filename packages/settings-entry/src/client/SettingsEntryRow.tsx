/** Direct Settings row at the sidebar foot, above the shipped account launcher. */
import { useState, type CSSProperties } from 'react'
import type { Config } from '../config.ts'
import { resolveRowLabel } from '../row.ts'
import { GearIcon } from './GearIcon.tsx'

/** Props from the slot owner plus this row's own face. */
export interface SettingsEntryRowProps {
  /** Whether the sidebar renders wide content (false = 56px rail). */
  readonly wide: boolean
  /** Validated row configuration. */
  readonly config: Config
  /** Open the shipped settings dialog. */
  readonly enterSettings: () => void
  /** Whether the shipped command path is reachable. */
  readonly available: boolean
}

/**
 * Layer geometry copied from the Cordis footer row so both footer actions
 * share one height and one left edge.
 */
const LAYER_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 100%',
  width: '100%',
  minWidth: 0,
  height: 42,
  margin: '4px 0 0',
}

/** The sidebar's collapsed foot centers 36px icon buttons. */
const LAYER_RAIL_STYLE: CSSProperties = {
  flex: 'none',
  width: 36,
  height: 36,
  margin: 0,
  justifyContent: 'center',
}

/**
 * Button geometry copied from the shipped settings trigger row (42px high,
 * 12px radius, 8px icon inset) so the extra entry reads as the same seat.
 */
const BUTTON_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  width: 'calc(100% + 4px)',
  height: 42,
  margin: '0 -2px',
  padding: '0 10px 0 8px',
  border: 0,
  borderRadius: 'var(--dsw-radius-md, 8px)',
  background: 'transparent',
  color: 'var(--dsw-alias-label-primary)',
  font: 'inherit',
  fontSize: 14,
  lineHeight: '22px',
  textAlign: 'left',
  cursor: 'pointer',
  overflow: 'hidden',
}

const BUTTON_RAIL_STYLE: CSSProperties = {
  width: 36,
  height: 36,
  margin: 0,
  padding: 0,
  justifyContent: 'center',
}

/** Derived from the primary ink so both palettes keep the hover readable. */
const HIGHLIGHT_STYLE: CSSProperties = {
  background: 'color-mix(in srgb, var(--dsw-alias-label-primary) 7%, transparent)',
}

const LABEL_STYLE: CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
}

/**
 * Render the direct Settings control. Icon-only in the rail, icon plus label
 * when the column is wide; the accessible name is always the configured label.
 * @param props - sidebar geometry plus the configured command face.
 * @returns the footer row, or nothing when the settings command is unreachable.
 */
export function SettingsEntryRow({
  wide,
  config,
  enterSettings,
  available,
}: SettingsEntryRowProps) {
  const [highlighted, setHighlighted] = useState(false)
  if (!available) return null
  const label = resolveRowLabel(config, wide)
  return (
    <span style={wide ? LAYER_STYLE : { ...LAYER_STYLE, ...LAYER_RAIL_STYLE }}>
      <button
        type="button"
        data-settings-entry={wide ? 'wide' : 'rail'}
        aria-label={config.label}
        title={label === undefined ? config.label : undefined}
        onClick={enterSettings}
        onPointerEnter={() => setHighlighted(true)}
        onPointerLeave={() => setHighlighted(false)}
        onFocus={() => setHighlighted(true)}
        onBlur={() => setHighlighted(false)}
        style={{
          ...BUTTON_STYLE,
          ...(wide ? {} : BUTTON_RAIL_STYLE),
          ...(highlighted ? HIGHLIGHT_STYLE : {}),
        }}
      >
        <GearIcon />
        {label !== undefined && <span style={LABEL_STYLE}>{label}</span>}
      </button>
    </span>
  )
}
