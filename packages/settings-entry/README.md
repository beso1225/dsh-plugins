# @beso1225/dsh-settings-entry

A direct Settings control at the DeepSeek Harness sidebar foot.

## Summary

The sidebar's bottom seat hosts the account/More launcher, and the Settings
dialog sits one level down inside that menu. This bundle adds a **separate**
Settings row above the launcher so the dialog opens in one click, while the
account menu keeps its own seat.

- **Wide sidebar:** gear icon plus a `Settings` label on a 42px row.
- **56px rail:** the same control as a 36px icon button with a tooltip.
- **No replacement:** the shipped `settings.launcher` contribution (account
  avatar, sign-in/out, contact) stays mounted and unchanged.

## Install

Publishable bundle:

```text
@beso1225/dsh-settings-entry
```

For a local checkout:

```sh
pnpm build
```

Then install the absolute `packages/settings-entry` directory as a bundle in the
Plugins page. The bundle patch inserts the `settings-entry` row; reload the page
after building new client code, or restart DSH when replacing an installed
client package.

## Configuration

The Host `Config` schema fills these values:

| Field       | Default      | Meaning                                                                 |
| ----------- | ------------ | ----------------------------------------------------------------------- |
| `showLabel` | `true`       | Render the row label in the expanded sidebar; the rail stays icon-only. |
| `label`     | `"Settings"` | Visible label, and the accessible name in both column states.           |

A profile patch can rename the entry without touching the bundle:

```yaml
- id: settings-entry
  config:
    label: 設定
```

Set `showLabel: false` to keep the expanded sidebar icon-only as well; the
control then shows the label in its native tooltip and accessible name only.

## How it works

`sidebar.footer.action` is an additive list slot declared by the sidebar. This
bundle registers one cell:

```text
id: settings-entry   order: -10   (before the shipped Cordis footer row at 0)
```

The component reads the owner's `wide` prop, draws its own gear glyph (no
Harness Client package import at runtime), and uses only `--dsw-alias-*` theme
tokens. Hover and focus tint derive from the primary label ink with
`color-mix`, because the reported token set has no interactive-hover alias.

### Opening the dialog

`settings.launcher` is the only seat that hands a plugin the shell's own
`openSettings` callback — but it is a `single` slot already occupied by
`@deepseek-ai/dsh-client-ui-settings-account`. Registering there would replace
the account menu.

Instead the row runs the command the Settings shortcut and the native menu run:

```ts
ctx.shortcuts.registry.invoke('settings.open', { modal: null })
```

`modal: null` is passed because the control is only reachable while no modal
covers the frame. The shipped resolver then opens the dialog exactly as the
`Mod+,` binding does.

`registry` is an internal field of the shortcuts service, not part of its public
`Shortcuts` interface. The access is isolated in `src/open.ts` behind a small
port, wrapped in a guard, and bounded by `engines.dsh`. The bundle declares
`shortcuts` in its `inject` list, so activation waits for the service; when the
service is present but its registry method is missing, the row renders
**nothing** instead of a dead button and logs one warning:

```text
settings-entry: the shortcuts service exposes no command registry,
so the Settings dialog cannot be opened from the sidebar.
```

See [ADR 0002](../../docs/adr/0002-direct-settings-entry.md).

## Compatibility

- DSH `>=0.2.1-rc.3 <0.3.0` (`engines.dsh`)
- React 18
- Node 22.19 or newer at runtime

The client bundle imports only React and the Harness module table. Styling uses
the theme tokens reported by the live Theme provider.

If a future DSH release makes the settings shell openable through a public
service, replace the `src/open.ts` port with that call; the row, the slot cell,
and the configuration stay unchanged.

## Development

```sh
fnm use
pnpm install
pnpm test          # opener port, row resolver, schema, component markup, entry
pnpm typecheck
pnpm build
pnpm check         # format, lint, typecheck, test, build, pack check
```

The package follows the repository conventions in the root `AGENTS.md`.
