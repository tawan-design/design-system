---
name: ds-handoff
description: Use when a designer hands off a feature (Figma flow) to engineering. Writes a handoff spec in design-system terms (components, props, DESIGN.md patterns, states) and lists DS-GAPs as ready-to-file issues. Trigger on "handoff", "hand off this flow", "write the spec for engineers", "dev handoff".
---

# DS handoff spec

A handoff that engineers (and their agents) can build **only with `@tawan-design/ui`**, without guessing.
If the `design:design-handoff` skill is available, follow its general structure. This skill adds the design-system mapping.

## Inputs (ask for anything missing)
| Input | Required |
|---|---|
| Figma flow URL (page or section containing all screens) | ✅ |
| PRD / ticket link or text | ✅ |
| Target platform + breakpoints | default: web, 375 / 768 / 1280 |
| Where the spec goes (GitHub issue / Jira / Linear / file) | default: markdown file |

## Step 1: Read the design (Figma MCP)
1. `get_metadata` on the flow: list frames (screens) in order and their states (frames named like `KYC / Upload / Error`).
2. For each screen: `get_design_context` + `get_screenshot`.
3. For every layer, decide: **DS instance** (main component from the DS library) · **layout** (frames/auto-layout) · **detached/custom** (looks like a component but isn't an instance, or has unbound values).
4. `get_code_connect_map` to confirm which instances map to code components.

**Stop and report first** if there are detached or custom layers. The designer should fix them or confirm they are intentional DS-GAPs.

## Step 2: Map to code
- Read `packages/ui/catalog.json` (in product repos: `node_modules/@tawan-design/ui/catalog.json`).
- Each instance → `<Component prop="value">`, using only props that exist in the catalog. Use the Figma → prop mapping: `Variant=Secondary` → `variant="secondary"`, `Size=Large` → `size="lg"`.
- Layout → token classes (`gap-16`, `p-24`), from auto-layout values bound to `space/*` variables.
- Match each screen to a **DESIGN.md pattern** (Money movement, Forms, Empty states…) and quote the rule that applies.

## Step 3: Write the spec
Use this template exactly:

```
# Handoff: <feature>
Figma: <url> · PRD: <link> · Designer: <name> · DS version: @tawan-design/ui@<x.y.z>

## Overview
<2–3 sentences: user goal, entry point, success>

## Flow
1. <Screen A> → 2. <Screen B> → ... (include branches: error, cancel)

## Screen: <name>   (one section per screen)
Figma: <node link> · Pattern: <DESIGN.md pattern + the rule that applies>
| Element | Component | Props | Notes |
|---|---|---|---|
| Primary CTA | Button | variant="primary" size="lg" fullWidth | Disabled until form valid |
| Amount field | Input | label="Amount (USD)" inputMode="decimal" hint=… | Error: "Enter an amount greater than 0" |
Layout: <container, gaps, padding as token classes>
States: default · loading · empty · error · success (what changes in each)
Responsive: <what changes at 375 / 768 / 1280>
Copy: <all user-facing strings, incl. errors>
Accessibility: <focus order, labels, announcements>

## Behavior & data
<validation rules, API states, analytics events if in PRD>

## DS-GAPs
| # | What's needed | Where | Workaround for now | Proposed DS change |
|---|---|---|---|---|

## Open questions
- ...
```

## Step 4: DS-GAPs → issues
For each DS-GAP, draft an issue in the format of `.github/ISSUE_TEMPLATE/new-component.yml` (problem, Figma link, where used, who builds).
Ask before creating them in the DS repo with `gh issue create --label proposal`.

## Rules
- Never invent props or components. Anything not in the catalog is a DS-GAP.
- Never put raw values in the spec (no hex, no px). Use token names.
- Save the spec as `handoff/<feature>.md` in the product repo, or post it where the user asked.
