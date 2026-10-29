# 0002: Add a Settings row beside the account launcher

## Status

Accepted.

## Context

The sidebar foot renders `sidebar.settings`, whose occupant (the settings shell)
draws a trigger row made of three parts:

- `settings.launcher` — one optional launcher with the shell's own
  `openSettings` callback, with the shipped Settings trigger as its fallback;
- a connection indicator;
- `sidebar.footer.action` — an additive list of extra controls.

`@deepseek-ai/dsh-client-ui-settings-account` registers the account/More menu
into `settings.launcher` unconditionally, so the plain Settings trigger is
replaced whenever the account feature is mounted. Settings then lives one level
down inside that menu.

The request is a direct Settings entry from the sidebar that keeps the account
menu intact.

## Decision

Register one cell in `sidebar.footer.action` (id `settings-entry`, order `-10`)
and open the dialog by running the shipped command:

```ts
ctx.shortcuts.registry.invoke('settings.open', { modal: null })
```

The command is the same entry point the `Mod+,` binding and the Desktop menu
use, so the dialog behaves identically. The access is isolated in
`src/open.ts` behind a `ShortcutsPort` interface, guarded with a function check
and a `try`/`catch`, and the row renders nothing when the port is unavailable.

## Consequences

- The account menu, sign-in flow, and contact entry keep their shipped seat.
- The entry is additive: disabling the bundle removes the row and restores the
  previous foot exactly.
- `registry` is an internal field of the shortcuts service. A patch release that
  renames it disables the row instead of crashing the sidebar; the
  `engines.dsh` range and the single warning in the console make the breakage
  diagnosable.
- The command is registered by the settings shell when its seat mounts, so a
  composition without settings has no dialog to open and the row stays inert.

## Alternatives rejected

- **Take `settings.launcher` at priority `-1`.** Uses the documented
  `openSettings` callback, but replaces the account menu with no way to render
  it from a third-party bundle.
- **Disable the account row from a profile patch.** Loses sign-in, sign-out, and
  contact for every user of the profile, and the shipped fallback trigger is not
  a menu.
- **Dispatch the `Mod+,` keydown event.** Depends on the platform-specific
  binding and on where focus sits, and writes to the page outside the component.
- **A main panel with a `sidebar.panellist` row.** Settings is a modal whose
  sections are registered under `sidebar.settings`; a main panel cannot render
  them, so the entry would open an empty page.
