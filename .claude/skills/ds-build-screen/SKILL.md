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
- Import only from `@tawan-design/ui`. Layout (flex, grid, gap, padding) uses token classes: `p-*`, `gap-*` from 2–64.
- Allowed color classes: `bg-surface|subtle|muted|brand|brand-hover|brand-soft|danger|danger-soft|success-soft|overlay`,
  `text-fg|fg-muted|fg-brand|fg-on-brand|fg-danger|fg-success`, `border-border|border-strong|border-focus|border-danger`.
- **Never**: raw hex/rgb, `[13px]`-style arbitrary values for spacing/color/radius/font size, a native `<button>`/`<input>` with styling, a custom modal.
- Only use props that exist in `catalog.json`.

## If something is missing
Don't fake it with `className` overrides. Stop, then either:
- use the closest existing component and add a `// DS-GAP: <what's missing>` comment, or
- ask the human whether to run `ds-component-from-figma`.

## Before finishing
Run `pnpm check`. Then self-review against `ds-audit` and report: components used, any DS-GAP comments, any rule you couldn't follow.
