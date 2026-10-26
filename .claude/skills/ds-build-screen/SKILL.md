---
name: ds-build-screen
description: Use whenever building or editing any product UI (screen, page, flow, form, modal) in this repo or in an app that consumes @tawan-design/ui. Ensures the design system is used instead of hand-rolled UI.
---

# Build a screen with the design system

## Before writing code
1. Read `packages/ui/catalog.json`. List the components you plan to use. `@tawan-design/ui` is already installed.
2. Read the matching pattern in `DESIGN.md` (e.g. "Money movement", "Forms").
3. If the screen comes from Figma, get the node with the Figma MCP and map **each Figma instance → catalog component**.
   Figma instance names match component names.

## While writing
- Import only from `@tawan-design/ui`. Layout (flex, grid, gap, padding) uses token classes: `p-*`, `gap-*` from the `space-*` scale (0–96).
- Every allowed class is generated in `packages/tokens/build/css/theme.css` and named exactly like the Figma variable:
  - Text and icons: `text-content-*` (`primary`, `secondary`, `tertiary`, `brand`, `link`, `danger`…), `text-icon-*`
  - Backgrounds: `bg-surface-*` for containers, `bg-action-*` for interactive fills (`action-brand`, `action-brand-hover`…)
  - Borders: `border-border-*` (`subtle`, `default` for decoration; `strong` for control boundaries), focus: `ring-focus-ring`
  - Type: `text-body-*`, `text-label-*`, `text-heading-*`, `text-code-*` (+ `font-mono`). Radius: `rounded-sm|md|lg|xl|xxl|pill`.
  - Sizes: `h-control-sm|md|lg`, `size-icon-*`, `size-avatar-*`. Opacity: `opacity-disabled|overlay|loading`.
- **Never**: raw hex/rgb, `[13px]`-style arbitrary values for spacing/color/radius/font size, a native `<button>`/`<input>` with styling, a custom modal.
- Only use props that exist in `catalog.json`.

## If something is missing
Don't fake it with `className` overrides. Stop, then either:
- use the closest existing component and add a `// DS-GAP: <what's missing>` comment, or
- ask the human whether to run `ds-component-from-figma`.

## Before finishing
Run `pnpm check`. Then self-review against `ds-audit` and report: components used, any DS-GAP comments, any rule you couldn't follow.
