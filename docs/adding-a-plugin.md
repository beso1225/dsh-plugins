# Adding a plugin

1. Copy `packages/model-label` to `packages/<name>` and change:
   - the package `name` to `@beso1225/dsh-<name>`;
   - the row id in `cordis.patch.yml`;
   - the locale titles and descriptions;
   - the icon (original or licensed);
   - the `engines.dsh` range only when the plugin genuinely targets another
     release.
2. Keep `src/index.ts` as the Host entry. Export a `Config` schema when the
   plugin has settings, and keep `apply` side-effect free unless the plugin owns
   Host behavior.
3. Put the browser entry in `src/client/index.ts`. Declare required services with
   `export const inject = [...]` and contribute through slots.
4. Keep pure behavior in a module without React or DSH imports, and add a
   Vitest case for it before implementing the change.
5. Update `dsh.client.inject` to the plugin rows that must activate first. Do not
   add library package names there; it only orders activation.
6. Add display metadata to `locale/en.json` and `locale/ja.json`, and an
   original SVG/PNG/WebP icon no larger than 256 KiB.
7. Run:

   ```sh
   pnpm test
   pnpm typecheck
   pnpm build
   pnpm check
   ```

8. Install the absolute package directory as a bundle in a DSH profile. Confirm
   the row appears in the Plugins page with its title, description, and icon.
9. Verify the actual UI behavior in the connected page, then disable the bundle
   and confirm the previous behavior returns.
10. Document the configuration, defaults, compatibility range, and limitations
    in the package README.

## Slot rules

- Register into an existing slot through
  `ctx.slots.inject('<slot>', () => ctx.slots.register(...))`.
- For `conversation.input.model.label`, use priority `-1`. Priority `0` is
  occupied by the shipped 1017 label; the same priority throws.
- Render only non-interactive inline content. The owner keeps clicks, focus,
  search, selection, and accessibility text.
- Do not write DOM outside the component or append to `document.body`.
- Use only the `--dsw-alias-*` tokens reported by the live Theme provider.

## Package checklist

- [ ] `dsh.bundle.patch` inserts the package's own row.
- [ ] `dsh.client` declares `platform: "web"` and the activation dependencies.
- [ ] `exports` exposes `.`, `./client`, `./locale/*.json`, and `./icon`.
- [ ] `files` includes `lib`, the patch, locales, the icon, and the README.
- [ ] `engines.dsh` states the supported DSH range.
- [ ] `pnpm check` passes.
- [ ] The package installs and the row is active in the live profile.
