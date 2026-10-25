# @beso1225/dsh-model-label

Provider-aware model labels and configurable release badges for the DeepSeek
Harness composer.

## Summary

The composer trigger normally shows only the model name and reasoning effort.
This bundle adds:

- the **provider display name** before the model name in the composer trigger and
  the root model menu;
- a **release badge** such as `1017` for provider/model pairs configured in the
  profile, including the OpenCode Go rule that ships by default.

The model name, model ids, provider routing, and selection behavior are
unchanged. The bundle only contributes the non-interactive
`conversation.input.model.label` slot.

## Install

Publishable bundle:

```text
@beso1225/dsh-model-label
```

For a local checkout:

```sh
pnpm build
```

Then install the absolute `packages/model-label` directory as a bundle in the
Plugins page. The bundle patch inserts the `model-label` row and the browser
entry loads with the other client modules. Reload the page after building new
client code; replacing an already installed client package may require a DSH
restart.

## Defaults

The Host `Config` schema fills these values:

| Field          | Default              | Meaning                                                |
| -------------- | -------------------- | ------------------------------------------------------ |
| `showProvider` | `true`               | Prefix the provider name in the trigger and root menu. |
| `presets`      | `["deepseek-1017"]`  | Reproduce the shipped DeepSeek 1017 routes.            |
| `badges`       | the OpenCode Go rule | Extra rules; the first matching rule wins.             |

Default badge rules:

| Provider            | Model id                   | Catalog name guard    | Badge  |
| ------------------- | -------------------------- | --------------------- | ------ |
| `deepseek-official` | `deepseek-flash`           | `DeepSeek-V4.1-Flash` | `1017` |
| `deepseek-account`  | `deepseek-flash`           | `DeepSeek-V4.1-Flash` | `1017` |
| `ollama-cloud`      | `deepseek-v4.1-flash:1017` | `DeepSeek-V4.1-Flash` | `1017` |
| `opencode-go`       | `deepseek-v4.1-flash`      | —                     | `1017` |

The first three live in the `deepseek-1017` preset. The OpenCode Go rule is a
default entry in `badges`. A profile patch that supplies `badges` replaces that
array, so restate the OpenCode Go rule if you want to keep it alongside new
rules; `presets` and `showProvider` keep their defaults.

## Configuration

Add a row override to the profile's `cordis.patch.yml`:

```yaml
- id: model-label
  config:
    showProvider: true
    badges:
      - provider: opencode-go
        model: deepseek-v4.1-flash
        label: '1017'
      - provider: my-router
        model: my-preview-model
        label: 'preview'
        tone: warning
```

Each badge rule supports:

| Field      | Required | Meaning                                                                                                |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `provider` | yes      | Provider id from the model catalog.                                                                    |
| `model`    | yes      | Model id from the model catalog.                                                                       |
| `name`     | no       | Exact catalog name guard; prevents labeling a different build with the same id.                        |
| `label`    | yes      | Badge text.                                                                                            |
| `tone`     | no       | `outline`, `solid`, `neutral`, `quiet`, `success`, `info`, `warning`, or `danger`; defaults to `info`. |

Explicit `badges` are evaluated before `presets`. The first match wins.

Disable the built-in preset rules while keeping your own:

```yaml
- id: model-label
  config:
    presets: []
```

Hide the provider prefix globally:

```yaml
- id: model-label
  config:
    showProvider: false
```

## How it works

`conversation.input.model.label` is a `single` slot. The shipped
`ui-deepseek-model-label-1017` plugin occupies it at priority `0`. This bundle
registers at priority `-1`, which shadows the shipped contribution because the
lowest live priority renders. The shipped plugin stays enabled, so disabling
this bundle restores the original `1017` badge.

Because the slot is replaced, the built-in DeepSeek routes are reproduced as the
`deepseek-1017` preset. The browser half is stateless: it reads the slot owner's
`provider`, `model`, and `placement`, then renders the configured label. It does
not fetch, cache, subscribe to session events, or change the selection.

Provider display is visual only. The trigger's accessible name and tooltip are
owned by the model-selection plugin and still name the model and effort. The
`/model` popup and the settings model editor also keep their catalog names; the
popup already shows providers as group headings.

## Compatibility

- DSH `>=0.2.1-rc.3 <0.3.0` (`engines.dsh`)
- React 18
- Node 22.19 or newer at runtime

The client bundle imports only React and the Harness module table. It does not
import a Harness Client package, so version drift cannot blank the slot. Styling
uses the theme tokens reported by the live Theme provider.

If a future DSH release adds the provider to the trigger itself, set
`showProvider: false` to keep only the badges.

## Development

```sh
fnm use
pnpm install
pnpm test          # resolver, schema, and component tests
pnpm typecheck
pnpm build
pnpm check         # format, lint, typecheck, test, build, pack check
```

The package follows the repository conventions in the root `AGENTS.md`.
