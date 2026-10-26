---
name: ds-audit
description: Use to measure how well code (a screen, a PR, an eval run) actually uses the design system. Produces a scored report across 6 dimensions. Also use for "is the agent using my design system?"
---

# Design system adoption audit

Score each dimension 0–100, then the weighted total. Criteria follow open-design-system-bench.

| # | Dimension | Weight | How to check |
|---|---|---|---|
| 1 | **Imports**: DS components used where one exists | 15% | Count UI elements that have a catalog equivalent. % that import from `@tawan-design/ui` (vs native `<button>`, `<input>`, custom modal markup). |
| 2 | **API fidelity**: no invented components/props | 25% | `pnpm typecheck`. Every prop used exists in `packages/ui/catalog.json`. Each invented prop −10. |
| 3 | **Token discipline**: no raw values | 15% | `node scripts/check-raw-values.mjs <path>`. Each violation −5. |
| 4 | **Accessibility basics** | 10% | Labels on inputs, alt text, focus visible, no div-buttons, dialogs via Radix. |
| 5 | **Compiles** | 5% | Build/typecheck passes → 100, else 0. |
| 6 | **Judgment** vs DESIGN.md | 30% | Read `DESIGN.md`. One primary action per view? Money flows have a review step? Status uses Badge? Light+dark safe? Explain each deduction. |

## Output format
```
DS audit: <target>
Total: 82/100
1 Imports        90  (1 hand-rolled <button> in Header.tsx:14)
2 API fidelity  100
3 Tokens         75  (5 raw values: ...)
4 A11y           80  (...)
5 Compiles      100
6 Judgment       70  (two brand buttons on Dashboard, ...)
Top 3 fixes: ...
Docs gaps: what in AGENTS.md / DESIGN.md / catalog would have prevented these?
```
The **Docs gaps** line matters most. Small, specific sentences added to AGENTS.md fix most failures.
Log results in `evals/results.md` with the date so the score can be tracked over time.
