# AGENTS.md — index only

This file **points** to the design system. It holds no values.
Everything lives where it is generated. Keep this file under 150 lines.

## Before writing any UI, read these

| Need | Source of truth | Notes |
|---|---|---|
| Tokens (color, space, radius, type) | `packages/tokens/src/*.json` | Exported from Figma Variables. **Never hand-edit.** Use the `ds-tokens-sync` skill. |
| Which components exist + their real props | `packages/ui/catalog.json` | Generated. If a prop isn't listed there, **it doesn't exist.** |
| How a component looks/behaves | `packages/ui/src/components/<Name>/<Name>.stories.tsx` | Stories show every supported state. |
| Brand intent, the "why", do/don't | `DESIGN.md` | Owner: Design lead. |
| Tailwind class ↔ token mapping | `packages/ui/src/styles.css` (`@theme` block) | |

## Hard rules

1. `@tawan-design/ui` **is already installed** in every app in this repo. Import from it. **Use existing components before building anything new.**
2. Never hand-roll a component that exists in `catalog.json` (no custom `<button>` with classes, no custom modal).
3. Never invent props. If you need one that doesn't exist, stop and propose it (see `ds-component-from-figma`).
4. No raw values: no hex, rgb, px or arbitrary Tailwind values for color, spacing, radius or font size.
   Use token classes only: `bg-surface`, `text-fg-muted`, `p-16`, `gap-8`, `rounded-12`, `text-14`.
   Tailwind's default palette and spacing are **disabled**, so `bg-blue-500` and `p-4` won't work, by design.
5. Components use **semantic** tokens only (`bg/brand`), never primitives (`blue/600`).
6. Interactive overlays (dialog, popover, select, tooltip, menu) must be built on Radix primitives.
7. Every new or changed component ships with a story, an updated `catalog.json` (`pnpm --filter @tawan-design/ui catalog`) and a changeset (`pnpm changeset`).
8. Anything not covered here → **ask the human instead of guessing.**

## Skills (in `.claude/skills/`)

- `ds-build-screen`: building any product UI with the system
- `ds-component-from-figma`: turning a Figma pattern into a DS component
- `ds-tokens-sync`: pulling Figma Variables into `packages/tokens`
- `ds-audit`: scoring how well generated code uses the system
- `ds-design-qa`: Figma frame vs built UI, match score /100 (`pnpm qa:snapshot`)
- `ds-drift-check`: Figma library vs `catalog.json` (`pnpm catalog:summary`)
- `ds-handoff`: feature handoff spec in design-system terms + DS-GAP issues

## Commands

```bash
pnpm dev            # Storybook at :6006 (components, foundations, pages)
pnpm playground     # simulated product at :5173
pnpm check          # typecheck + raw-value audit (CI runs this)
pnpm changeset      # describe your change for the changelog
pnpm qa:snapshot <url> --name x --theme both   # built-UI side of design QA
pnpm catalog:summary                           # code side of a drift check
```

## Repo map

```
packages/tokens   Figma Variables → CSS vars (Style Dictionary)
packages/ui       React components + stories + Code Connect + catalog.json
apps/docs         Storybook: Introduction, Foundations, Components, Pages
apps/playground   Simulated product built only from @tawan-design/ui
evals/            Prompts used to measure agent adoption of the DS
```
