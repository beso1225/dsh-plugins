# DSH plugins

A small monorepo of composable [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
plugins. Each package is a self-contained DSH bundle: a Host entry, an optional
browser entry, a `cordis.patch.yml`, display metadata, and tests.

## Plugins

| Package                                                       | What it does                                                                                           | DSH                   |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------- |
| [`@beso1225/dsh-model-label`](packages/model-label/README.md) | Shows the provider beside the composer model name and adds configurable release badges such as `1017`. | `>=0.2.1-rc.3 <0.3.0` |

## Why this layout

- **One installable unit per plugin.** `install_bundle` operates on a package
  directory or npm spec, so each `packages/*` directory carries its bundle patch,
  Host entry, browser entry, locale resources, and icon together.
- **Flat packages.** Adding a plugin means adding `packages/<name>`; shared code
  moves to `packages/internal/*` only when a second plugin actually needs it.
- **Generated `lib/`.** Build output is not committed. Build before installing a
  local checkout; npm releases include `lib/` through `files`.
- **Thin browser halves.** UI plugins register through slots and keep only the
  state the slot owner already provides. No Host service is needed for a label.

## Requirements

- Node **24.22.1** through fnm (`.node-version`)
- pnpm **12.14.0** (`packageManager` in `package.json`)

```sh
fnm use
pnpm install
pnpm check
```

`pnpm check` runs Prettier, oxlint, TypeScript, Vitest, the package builds, and
the packed-file checks. The repository intentionally uses pnpm scripts instead
of a separate task runner.

## Installing a local package

```sh
pnpm build
```

Then install the absolute `packages/model-label` directory as a bundle in the
current DSH profile, and reload the page (or restart DSH after replacing a
previously installed package). See the package README for configuration.

## Adding a plugin

Read [`docs/adding-a-plugin.md`](docs/adding-a-plugin.md) and the architecture
note in [`docs/architecture.md`](docs/architecture.md).

## License

MIT
