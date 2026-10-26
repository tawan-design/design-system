---
name: ds-tokens-sync
description: Use when Figma Variables changed and packages/tokens needs updating, or when asked to "sync tokens". Pulls variables via the Figma MCP, writes the raw export + DTCG JSON, rebuilds, reports breaking changes.
---

# Sync tokens from Figma Variables

Source of truth: the Figma file **TAWAN DESIGN SYSTEM** (`fileKey uNA3UaYp45IFe6bAe9JjK6`), local variables.

## The pipeline

```
Figma Variables
  → packages/tokens/figma/variables.json   raw export (this skill writes it)
  → pnpm --filter @tawan-design/tokens from-figma
  → packages/tokens/src/*.json              DTCG tokens (generated, never hand-edit)
  → pnpm tokens
  → build/css/tokens.css                    CSS variables
  → build/css/theme.css                     Tailwind classes (generated)
```

**Names are never translated.** The CSS variable is the Figma code syntax, and the class keeps the Figma name:
Figma `content-secondary` → `var(--content-secondary)` → `text-content-secondary`.
Figma `space-16` → `var(--space-16)` → `p-16`. Figma `radius-md` → `rounded-md`. Figma `body-md-*` → `text-body-md`.

| Figma collection | Default mode (built) | File |
|---|---|---|
| `00 Primitives` | Brand 1 | `src/primitives.json` |
| `Colors` | Light / Dark | `src/semantic.light.json`, `src/semantic.dark.json` |
| `Spacing`, `Radius`, `Size`, `Border`, `Opacity`, `Elevation`, `Typography`, `Font family` | Value · Balanced · Font1 | `src/scales.json` |
| Other modes (Brand 2, Sharp, Rounded, Font2) | not built yet | `src/modes/*.json` |

A new collection fails the converter on purpose: add it to `COLLECTIONS` in `scripts/from-figma.mjs` and ask the human which mode is the default.

## Steps

1. **Pre-flight in Figma** (read-only `use_figma`, load the `figma-use` skill first):
   - Every variable has a WEB code syntax, and **no two variables share one**. Report duplicates and stop.
   - Semantic variables alias primitives. Report raw (non-alias) colors in `Colors`.
2. **Export** every local variable into `packages/tokens/figma/variables.json`, in the format described in that file
   (`[name, type, codeSyntax, values per mode, description?]`, `@name` for aliases).
3. **Verify the export** against Figma: compute the same checksum on both sides (sorted
   `collection|name|type|code|values` lines, 31-multiplier hash) and compare count, length and hash. They must match.
4. `pnpm --filter @tawan-design/tokens from-figma`, then `pnpm tokens`.
5. `git diff packages/tokens/src` and classify every change:
   - **Added**: list it. It gets a class automatically (`theme.css`). Mention it in the PR.
   - **Value changed**: patch. Note visual impact (which components use it).
   - **Renamed/removed**: **breaking**. `grep` the repo for the old CSS variable and class, list every file affected. Don't fix silently.
6. If a new **type role** or scale value appeared, add it to `packages/ui/src/lib/cn.ts` (tailwind-merge config).
7. `pnpm check`, then `pnpm changeset` describing the change.
8. Open a PR labelled `tokens` with the classified list. The designer reviews **Foundations/Review** in Chromatic (Light + Dark) and approves (CODEOWNERS).
