/** Public configuration model for the direct Settings entry. */

/** Plugin row configuration. */
export interface Config {
  /** Render the row label in the expanded sidebar; the rail stays icon-only. */
  showLabel: boolean
  /** Visible row label, also used as the control's accessible name. */
  label: string
}
