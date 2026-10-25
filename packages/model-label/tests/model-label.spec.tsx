import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ModelLabel } from '../src/client/ModelLabel.tsx'
import { DEFAULT_CONFIG } from '../src/defaults.ts'

const provider = { id: 'opencode-go', name: 'OpenCode Go' }
const model = { id: 'deepseek-v4.1-flash', name: 'DeepSeek-V4.1-Flash' }

describe('ModelLabel', () => {
  it('renders the provider, catalog name, and badge in the trigger', () => {
    const html = renderToStaticMarkup(
      <ModelLabel provider={provider} model={model} placement="trigger" config={DEFAULT_CONFIG} />,
    )
    expect(html).toContain('OpenCode Go')
    expect(html).toContain('DeepSeek-V4.1-Flash')
    expect(html).toContain('1017')
    expect(html).toContain('data-tone="info"')
  })

  it('omits the provider in an option row', () => {
    const html = renderToStaticMarkup(
      <ModelLabel provider={provider} model={model} placement="option" config={DEFAULT_CONFIG} />,
    )
    expect(html).not.toContain('OpenCode Go')
    expect(html).toContain('DeepSeek-V4.1-Flash')
    expect(html).toContain('1017')
  })

  it('returns the catalog name when provider display is off and no badge applies', () => {
    const html = renderToStaticMarkup(
      <ModelLabel
        provider={{ id: 'ollama-local', name: 'Ollama Local' }}
        model={{ id: 'qwen3.5:4b', name: 'Qwen 3.5 4B' }}
        placement="trigger"
        config={{ ...DEFAULT_CONFIG, showProvider: false, presets: [], badges: [] }}
      />,
    )
    expect(html).toBe('Qwen 3.5 4B')
  })
})
