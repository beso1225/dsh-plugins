import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SettingsEntryRow } from '../src/client/SettingsEntryRow.tsx'
import { DEFAULT_CONFIG } from '../src/defaults.ts'

const noop = () => {}

describe('SettingsEntryRow', () => {
  it('renders a labelled button in the expanded sidebar', () => {
    const html = renderToStaticMarkup(
      <SettingsEntryRow wide config={DEFAULT_CONFIG} enterSettings={noop} available />,
    )
    expect(html).toContain('data-settings-entry="wide"')
    expect(html).toContain('aria-label="Settings"')
    expect(html).toContain('>Settings</span>')
    expect(html).not.toContain('title=')
    expect(html).toContain('<svg')
  })

  it('keeps the rail control icon-only but named', () => {
    const html = renderToStaticMarkup(
      <SettingsEntryRow wide={false} config={DEFAULT_CONFIG} enterSettings={noop} available />,
    )
    expect(html).toContain('data-settings-entry="rail"')
    expect(html).toContain('aria-label="Settings"')
    expect(html).toContain('title="Settings"')
    expect(html).not.toContain('>Settings</span>')
  })

  it('hides the label when the configuration disables it', () => {
    const html = renderToStaticMarkup(
      <SettingsEntryRow
        wide
        config={{ ...DEFAULT_CONFIG, showLabel: false }}
        enterSettings={noop}
        available
      />,
    )
    expect(html).not.toContain('>Settings</span>')
    expect(html).toContain('title="Settings"')
  })

  it('renders no dead control when the command path is unreachable', () => {
    const html = renderToStaticMarkup(
      <SettingsEntryRow wide config={DEFAULT_CONFIG} enterSettings={noop} available={false} />,
    )
    expect(html).toBe('')
  })
})
