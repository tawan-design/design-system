---
name: ds-drift-check
description: Use to find drift between the Figma component library and the code library (catalog.json): components that exist only on one side, property/variant mismatches, missing stories or Code Connect. Trigger on "drift check", "is Figma in sync with code", "library audit", or as part of the monthly DS health check.
---

# Drift check: Figma library ↔ code library

Answers one question: **do Figma and code describe the same system?** Report only; changes go through the normal recipes.

## Inputs
- Figma DS file URL (the file with the `Components` page). Ask if missing.
- This repo (reads `packages/ui/catalog.json`, `*.figma.tsx`, stories).

## Step 1: Code side
```bash
pnpm --filter @tawan-design/ui catalog      # make sure catalog.json is fresh
node scripts/catalog-summary.mjs      # table: component, props + allowed values, story, Code Connect
```

## Step 2: Figma side (Figma MCP)
1. `get_metadata` on the `Components` page (or `search_design_system` on the file): list every **component set** and standalone **component**.
2. For each: variant properties and their values, boolean/text/instance-swap properties.
3. `get_code_connect_map`: which Figma components are already mapped to code.
4. `get_variable_defs` on the Foundations page: variable names, to compare with `packages/tokens/src/*.json`.

## Step 3: Match and compare
Match by name: Figma `Button` ↔ code `Button`. Sub-parts (`CardHeader`) match nested Figma components or are marked "code-only part, OK".
Property mapping rule: Figma `Variant` → `variant`, values lowercased (`Primary` → `primary`); `Size` `Small|Medium|Large` → `sm|md|lg`; `State=Disabled` → `disabled`; Figma text property → string prop.

Classify every difference:
| Type | Example | Severity |
|---|---|---|
| **Figma only** | `Tooltip` component set has no code | High if used in product screens, else Medium |
| **Code only** | `Badge` exists in code, not in Figma | Medium (run Recipe I: code → Figma) |
| **Property missing** | Figma `Button` has `Icon` property, code has no `icon` prop | High |
| **Value mismatch** | Figma `Tone=Warning`, code tone has no `warning` | High |
| **Naming mismatch** | Figma `Type`, code `variant` | Low (rename one side) |
| **No story** | component without `.stories.tsx` | Medium |
| **No / placeholder Code Connect** | missing `.figma.tsx` or `FILE_KEY` URL | Low |
| **Token drift** | variable in Figma not in token JSON, or vice versa | High → run `ds-tokens-sync` |

## Step 4: Report
Save as `evals/drift/<YYYY-MM-DD>.md` and show it:

```
# Drift check: <date>
Figma: <url> · catalog.json: <n> components · Figma: <n> component sets
In sync: 7 · Drift items: 5 (High 2 · Medium 2 · Low 1)

| # | Component | Type | Figma | Code | Severity | Next step |
|---|---|---|---|---|---|---|
| 1 | Button | Property missing | Icon (instance swap) | – | High | Recipe D: add `icon` prop |
| 2 | Badge | Code only | – | Badge (tone) | Medium | Recipe I: push to Figma |

## Token drift
...

## Suggested issues
- [ ] "Add icon slot to Button" (label: proposal) — body: ...
```

Offer to open the suggested issues with `gh issue create` (ask first).
Add one line to `evals/README.md` → "Track over time" with the drift count.
