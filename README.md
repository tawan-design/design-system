# Design System

Owned by the Design team. Figma Variables → tokens → React components → Storybook docs → simulated product.

**Stack:** React + TypeScript · Radix (behavior and accessibility) · Tailwind v4 (styling, locked to tokens) · Style Dictionary (tokens) · Storybook (docs) · Changesets (releases)

## Quick start

```bash
pnpm install
pnpm dev          # Storybook → http://localhost:6006
pnpm playground   # Simulated product → http://localhost:5173
npx playwright install chromium   # once, for design QA screenshots
```

## What's where

| Path | What |
|---|---|
| `packages/tokens/src` | Token JSON exported from Figma Variables (never hand-edit) |
| `packages/ui/src/components` | Components, each with `.tsx`, `.stories.tsx`, `.figma.tsx` (Code Connect) |
| `packages/ui/catalog.json` | Generated list of components and props, read by AI agents |
| `apps/docs` | Storybook: Introduction, Foundations, Components, Pages |
| `apps/playground` | Real product flows built only from the system |
| `AGENTS.md` / `DESIGN.md` | Index for AI agents / the "why", owned by Design |
| `.claude/skills` | Workflows Claude follows: tokens sync, Figma → component, build screen, audit, design QA, drift check, handoff |
| `docs/` | The team playbook (`playbook.html`, `PLAYBOOK.md`) |
| `evals/` | Measures whether agents actually use the system |

## Use in a product app

```bash
pnpm add @tawan-design/ui      # from GitHub Packages
```
```tsx
import "@tawan-design/ui/styles.css";   // once, at the app root
import { Button } from "@tawan-design/ui";
```

## First-time setup checklist
- [x] Find/replace `@yourco` with your GitHub org name (done: `@tawan-design`)
- [ ] Create GitHub teams `design-system` and `frontend-leads` (or edit `.github/CODEOWNERS`)
- [ ] Protect `main`: require PR, CODEOWNERS review, CI passing
- [ ] Add `CHROMATIC_PROJECT_TOKEN` secret (Storybook previews + visual review)
- [ ] Enable GitHub Discussions (for RFCs)
- [ ] Replace `FILE_KEY` / node ids in `*.stories.tsx` and `*.figma.tsx` with your Figma file
- [ ] Run `ds-tokens-sync` to replace the sample tokens with your Figma Variables

See `CONTRIBUTING.md` for the collaboration flow and `GOVERNANCE.md` for who decides what.
