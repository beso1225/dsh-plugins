# Architecture

## Install unit

Every plugin is one package below `packages/`. A package is a DSH bundle when
`package.json` declares:

```json
{
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": { "platform": "web", "inject": ["@deepseek-ai/dsh-client-ui-model-selection"] }
  }
}
```

The patch inserts the package's own row:

```yaml
- insert:
    - id: model-label
      name: '@beso1225/dsh-model-label'
```

The Loader resolves the row's package name from the profile's dependencies and
loads the Host entry (`lib/index.js`). The client-modules node half sees the
package's `dsh.client` declaration and adds `lib/client.js` to the browser
roster.

## Host and browser halves

```text
cordis.patch.yml
  └─ row "model-label"
       ├─ lib/index.js  (Host)    exports Config schema + no-op apply()
       └─ lib/client.js (browser) __ModuleLoader__.load({ id, factory })
                                     └─ apply(ctx, config)
                                          └─ ctx.slots.inject(
                                               'conversation.input.model.label',
                                               () => ctx.slots.register({ priority: -1 }, Label))
```

The Host schema validates and defaults the row config. The browser half receives
the validated config in `apply`; it fills the same defaults again as a defensive
fallback when activated without a validated row.

## Why the label shadows the shipped plugin

`conversation.input.model.label` is declared `single`. Registering at the same
priority throws; registering at a different priority shadows the occupant, and
the lowest live priority renders. The shipped 1017 label sits at `0`, so this
plugin registers at `-1`:

- no shipped row is disabled;
- disabling this bundle restores the official 1017 badge immediately;
- the plugin must reproduce the shipped rules because it replaces their output.

The reproduced rules are the `deepseek-1017` preset. The OpenCode Go rule is an
additional default `badges` entry, not part of the preset.

## Configuration flow

```text
profile patch config
  → Loader validates with src/schema.ts
  → client apply(ctx, config)
  → resolveConfig(config)
  → resolveLabel({ provider, model, placement }, config)
  → ModelLabel renders provider · model [badge]
```

Explicit `badges` are checked first, then the enabled presets. A rule matches on
provider id, model id, and the optional exact catalog-name guard.

## Build

`scripts/build-package.mjs` performs three steps in the package directory:

1. `tsc -p tsconfig.build.json` emits declarations to `lib/types/`.
2. esbuild bundles `src/index.ts` to `lib/index.js` (ESM, packages external).
3. esbuild bundles `src/client/index.ts` to a CJS browser artifact and wraps it
   with a banner/footer that calls `window.__ModuleLoader__.load({ id, factory })`.

The browser bundle externalizes React and `@deepseek-ai/*`. It must not import a
Harness Client package at runtime; the plugin owns its badge markup and uses
theme tokens only.

## Verification surface

Unit tests cover the pure resolver and the schema defaults. Live verification
checks the slot occupants and the rendered composer. `/model` popup rows and the
settings editor are outside the label slot and keep the catalog name.
