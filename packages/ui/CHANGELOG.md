# @tawan-design/ui

## 0.2.0

### Minor Changes

- ab308ec: **BREAKING: tokens now come from the TAWAN DESIGN SYSTEM Figma file, with Figma names.**

  - All 360 Figma variables are exported (`packages/tokens/figma/variables.json`) and converted to DTCG tokens.
    Defaults built: Light/Dark, Brand 1, Balanced radius, Font1. Brand 2, Sharp/Rounded radius and Font2 are stored in `src/modes/`.
  - CSS variables use the Figma code syntax: `--content-primary`, `--surface-canvas`, `--action-brand`, `--space-16`, `--radius-md`, `--body-md-font-size`. The `--ds-*` variables are removed.
  - Tailwind classes are generated from the tokens and keep the Figma names: `bg-surface-primary`, `text-content-secondary`, `border-border-strong`, `rounded-md`, `text-body-md`, `h-control-md`. The starter classes (`bg-surface`, `text-fg-muted`, `rounded-8`, `text-14`…) are removed.
  - The starter sample components (Button, Input, Badge, Card, Dialog) are removed. Components are rebuilt from the Figma library, one per release.

### Patch Changes

- Updated dependencies [ab308ec]
  - @tawan-design/tokens@0.2.0
