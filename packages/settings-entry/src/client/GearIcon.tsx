/** Original gear glyph used by the Settings row and the package icon. */
import type { CSSProperties } from 'react'

/** Base geometry: an eight-tooth gear drawn inside a 16px box, with an even-odd hub. */
const GEAR_PATH =
  'M13.168 6.615 L15.041 6.758 A7.15 7.15 0 0 1 15.041 9.242 L13.168 9.385 A5.35 5.35 0 0 1 12.633 10.675 L13.857 12.101 A7.15 7.15 0 0 1 12.101 13.857 L10.675 12.633 A5.35 5.35 0 0 1 9.385 13.168 L9.242 15.041 A7.15 7.15 0 0 1 6.758 15.041 L6.615 13.168 A5.35 5.35 0 0 1 5.325 12.633 L3.899 13.857 A7.15 7.15 0 0 1 2.143 12.101 L3.367 10.675 A5.35 5.35 0 0 1 2.832 9.385 L0.959 9.242 A7.15 7.15 0 0 1 0.959 6.758 L2.832 6.615 A5.35 5.35 0 0 1 3.367 5.325 L2.143 3.899 A7.15 7.15 0 0 1 3.899 2.143 L5.325 3.367 A5.35 5.35 0 0 1 6.615 2.832 L6.758 0.959 A7.15 7.15 0 0 1 9.242 0.959 L9.385 2.832 A5.35 5.35 0 0 1 10.675 3.367 L12.101 2.143 A7.15 7.15 0 0 1 13.857 3.899 L12.633 5.325 Z M10.5 8A2.5 2.5 0 1 0 5.5 8A2.5 2.5 0 1 0 10.5 8Z'

const GEAR_STYLE: CSSProperties = { flex: 'none' }

/** Rendered size in CSS pixels; the shipped sidebar glyphs use 16. */
const GEAR_SIZE = 16

/**
 * Decorative gear matching the sidebar's 16px glyph slot. The surrounding
 * button carries the accessible name.
 * @returns one inline SVG, hidden from assistive technology.
 */
export function GearIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={GEAR_SIZE}
      height={GEAR_SIZE}
      viewBox="0 0 16 16"
      style={GEAR_STYLE}
    >
      <path d={GEAR_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}
