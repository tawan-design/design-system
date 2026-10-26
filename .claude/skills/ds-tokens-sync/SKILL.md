---
name: ds-tokens-sync
description: Use when Figma Variables changed and packages/tokens needs updating, or when asked to "sync tokens". Pulls variables via the Figma MCP, writes DTCG JSON, rebuilds, reports breaking changes.
---

# Sync tokens from Figma Variables

## Mapping (Figma → files)
| Figma collection / mode | File |
|---|---|
| `Primitives` | `packages/tokens/src/primitives.json` |
| `Semantic` / `Light` | `packages/tokens/src/semantic.light.json` |
| `Semantic` / `Dark` | `packages/tokens/src/semantic.dark.json` |

Figma variable `bg/surface` → JSON path `color.bg.surface` → CSS `--ds-color-bg-surface` → Tailwind `bg-surface`.
Semantic variables that alias a primitive must stay aliases: `{color.blue.600}`, not the hex.

## Steps
1. Get variables with the Figma MCP (`get_variable_defs` on the Foundations page) for the DS file.
2. Write the DTCG JSON (`$type`, `$value`) into the files above. Keep key order stable to keep diffs small.
3. `pnpm tokens`, then diff `git diff packages/tokens/src`.
4. Classify every change:
   - **Added**: list it. If it's semantic, add it to the `@theme` block in `packages/ui/src/styles.css` and to `ds-build-screen`'s allowed list.
   - **Value changed**: patch.
   - **Renamed/removed**: **breaking**. Grep the repo for usages and list every file affected. Don't fix silently.
5. `pnpm check`, then `pnpm changeset` describing the change.
6. Open a PR labelled `tokens` with the classified list. A designer must approve it (CODEOWNERS).
