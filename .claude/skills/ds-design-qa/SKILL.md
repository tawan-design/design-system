---
name: ds-design-qa
description: Use to measure how closely built UI (a Storybook story, the playground, or a product page) matches its Figma design. Produces a match score /100 and a mismatch table. Trigger on "design QA", "does this match Figma", "compare with Figma", "pixel check", "UI vs design".
---

# Design QA: Figma vs built UI

Compares a **Figma frame** with the **built UI** and scores the match. Report only; never fix anything during QA.

## Inputs (ask for anything missing)
| Input | Example |
|---|---|
| Figma frame URL (with `node-id`) | `https://www.figma.com/design/<key>/...?node-id=12-345` |
| Built UI URL | Storybook: `http://localhost:6006/iframe.html?id=<story-id>` · Playground: `http://localhost:5173` |
| Viewport | Default: the Figma frame's width × height |
| Themes | `light`, `dark` or `both` (default `both` if the frame has a dark version, else `light`) |

The built UI must be running (`pnpm dev` or `pnpm playground`). For a Storybook story, always use the `iframe.html?id=` URL, not the manager URL.

## Step 1: Figma side (Figma MCP)
For the frame node:
1. `get_metadata`: layer tree, component instances (main component name + variant properties), sizes.
2. `get_design_context`: layout (auto-layout gaps, padding), styles, bound variables.
3. `get_variable_defs`: variables used, by name (`bg/surface`, `space/16`…).
4. `get_screenshot`: save it as `qa-output/<name>/figma.png`.

Write down a **Figma inventory**: each instance → `{component, variant props, text, size}`, plus frame-level gaps and padding.
Flag **detached / unbound** layers (raw hex or numbers with no variable) in Figma itself. They are design-side issues.

## Step 2: Built side (script)
```bash
node scripts/qa-snapshot.mjs "<built URL>" --name <name> --viewport <W>x<H> --theme <light|dark|both>
```
It writes `qa-output/<name>/`:
- `screenshot-<theme>.png`
- `snapshot-<theme>.json`: `dsComponents` (counts of `data-ds` roots), `handRolled` (buttons/inputs/dialogs not from the DS), `rawValues` (computed values that match no token), and `elements[]` with each element's box and **reverse-mapped tokens** (`--ds-color-bg-surface`, `--ds-space-16`…)
- `summary-<theme>.md`

Token name mapping: Figma `bg/surface` = CSS `--ds-color-bg-surface` = class `bg-surface`. Figma `space/16` = `--ds-space-16` = `p-16`/`gap-16`.

## Step 3: Compare and score

| # | Check | Weight | How |
|---|---|---|---|
| 1 | **Components** | 25 | Every Figma instance has the same DS component in `dsComponents` (match by name). −5 per missing or substituted component, −5 per `handRolled` item |
| 2 | **Variants & props** | 20 | Figma variant properties vs rendered result (e.g. Figma `Variant=Secondary` → button has secondary tokens: `bg-surface` + `border-default`). −4 per mismatch |
| 3 | **Tokens** | 30 | For each element, compare Figma variable names with the reverse-mapped tokens. −3 per wrong token, −3 per `RAW` value |
| 4 | **Layout & spacing** | 15 | Auto-layout gap/padding vs `gap`/`padding` tokens; element sizes within ±2px; same order and alignment. −3 per mismatch |
| 5 | **Visual** | 10 | Look at `figma.png` vs `screenshot-<theme>.png` side by side: hierarchy, alignment, anything missing or extra. Deduct by judgment, explain each |

Do it per theme. The final score is the lowest theme score, so dark mode can't hide.
Content differences (sample text, numbers) are **not** mismatches unless the length breaks the layout.

## Step 4: Report
Save to `qa-output/<name>/report.md` and show it:

```
# Design QA: <name>
Figma: <url> · Built: <url> · Viewport: 1280×800 · Themes: light, dark
Score: 86/100 (light 91 · dark 86)  ✅ ≥90 pass · ⚠️ 75–89 fix before merge · ❌ <75 rework

| # | Check | Score | Notes |
|---|---|---|---|
| 1 | Components | 25/25 | |
| 2 | Variants & props | 16/20 | ... |
| 3 | Tokens | 24/30 | ... |
| 4 | Layout & spacing | 12/15 | ... |
| 5 | Visual | 9/10 | ... |

## Mismatches
| # | Element | Figma | Built | Fix in | Suggested fix |
|---|---|---|---|---|---|
| 1 | "View all" button | Variant=Secondary | ghost tokens | Code | `variant="secondary"` in Dashboard.tsx |
| 2 | Card padding | space/24 | --ds-space-20 | Figma? | DESIGN.md says p-20 for cards: confirm with designer |

## Design-side issues (Figma)
- Detached layers / unbound values found in the frame

## Screenshots
figma.png · screenshot-light.png · screenshot-dark.png
```

**Fix in** is either `Code` (the build is wrong), `Figma` (the design breaks a DS rule or uses an unbound value), or `DS` (a component can't express the design: open a "New component / variant" issue).

## Rules
- Never edit code or Figma during QA. Offer fixes after the report.
- When Figma and DESIGN.md disagree, flag it. Don't pick a side.
- `qa-output/` is gitignored. Attach `report.md` + screenshots to the PR instead.
