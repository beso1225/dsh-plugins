# AGENTS.md

This repository ships small, independently installable DeepSeek Harness
plugins. Write repository documentation, comments, commit messages, and pull
requests in English. Reply to the user in Japanese.

## Commands

```sh
fnm use                 # Node 24.22.1 from .node-version
pnpm install
pnpm check              # format, lint, typecheck, test, build, pack check
```

Use `pnpm build` before installing a local package directory as a DSH bundle.
`lib/` is generated and gitignored; never edit it by hand.

## Layout

- `packages/<name>/` — one installable bundle. A package contains
  `src/index.ts` (Host entry), optional `src/client/index.ts` (browser entry),
  `cordis.patch.yml`, `locale/*.json`, `icon.svg`, and tests.
- `packages/internal/*` — a private workspace package only when two plugins
  share code. Do not create it speculatively.
- `scripts/build-package.mjs` — TypeScript declarations plus the esbuild Host
  and browser bundles.
- `scripts/check-package.mjs` — artifact, metadata, icon, and packed-file
  checks.
- `docs/` — architecture, adding a plugin, and decisions.

## Plugin rules

1. **One bundle per package.** Declare `dsh.bundle.patch` and insert the
   package's own row. Do not disable shipped rows in the package patch.
2. **Label slot priority.** `conversation.input.model.label` is `single` and the
   shipped 1017 plugin occupies priority `0`. Register model labels at `-1` so
   they shadow it and leave the shipped plugin as the fallback.
3. **No Harness Client package imports at runtime.** The client bundle may
   externalize only React and the module table. Build the controls and badges
   inside the plugin, copy the host primitive's geometry when needed, and use
   only `--dsw-alias-*` theme tokens. `dsh.client.inject` only orders activation.
4. **Keep the browser half stateless.** Read slot owner props; do not subscribe
   to session events, fetch, cache, or write DOM outside the component.
5. **Separate schema, defaults, and pure logic.** `src/config.ts` is types only,
   `src/defaults.ts` is shared data, `src/schema.ts` is the Host schema, and
   `src/label.ts` is a pure resolver that tests can call without React.
6. **Config is the user's extension point.** Put tunable behavior in `Config`
   with sensible defaults so profile patches survive upgrades.
7. **Test behavior first.** Add a focused Vitest case for the resolver or
   schema before changing its behavior. UI-only appearance is verified in the
   live page.

## Verification

- `pnpm check` must pass.
- After installation, confirm the live slot has this plugin at priority `-1`
  and that the shipped plugin remains at `0`.
- Check the composer trigger, the root model menu, and an option row in the GUI.
- Disable the bundle and confirm the shipped 1017 badge returns.
- Do not change the user's DSH profile outside the workspace without approval.

## Display resources

Every installable package needs an original or licensed icon, `meta.title` and
`meta.description` in `locale/en.json`, and Japanese metadata in
`locale/ja.json` where the repository supports it.
