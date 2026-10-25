# 0001: Shadow the shipped model label at the slot

## Status

Accepted.

## Context

The composer's `conversation.input.model.label` slot is declared `single`. The
shipped `ui-deepseek-model-label-1017` plugin occupies it at priority `0`, and
another registration at the same priority throws. The slot registry renders the
lowest live priority, so a higher-numbered contribution would not appear.

We need two additions to the same label:

- the provider display name before the model name;
- configurable release badges, including the shipped DeepSeek 1017 routes and
  other providers serving the same build.

Splitting these into two plugins is impossible: only one component can render in
the slot.

## Decision

Register one combined label at priority `-1`. Leave the shipped 1017 plugin
enabled at priority `0` as the fallback. Reproduce the shipped rules as the
`deepseek-1017` preset, and expose additional rules through `Config.badges`.

Explicit badges are evaluated before presets. `presets` can be emptied without
disabling the bundle; `showProvider` can be turned off when a future DSH release
adds the provider prefix itself.

## Consequences

- Disabling or removing this bundle restores the official 1017 badge without a
  profile patch.
- The plugin owns the full label while enabled, including the official routes.
  New shipped routes must be added to the preset or to explicit badges.
- The provider prefix is visual; the trigger's accessible name remains owned by
  the model-selection plugin.
- A future shipped priority change or slot-kind change can conflict; the
  `engines.dsh` range and the live slot inspection catch it before release.

## Alternatives rejected

- **Disable the shipped row and register at priority 0.** More invasive, loses
  the automatic fallback, and makes a failed plugin remove the label entirely.
- **Replace the whole `conversation.input.model` seat.** Reimplements selection,
  focus, search, routing, and accessibility for a presentational change.
- **CSS targeting `data-provider-id`.** Could show the raw provider id but not
  its localized display name or a badge, and would depend on DOM internals.
