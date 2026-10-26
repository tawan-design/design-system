---
name: ds-component-from-figma
description: Use when turning a Figma component or a proven pattern into a new (or updated) design system component in packages/ui. Covers variants, props, token bindings, story, Code Connect and catalog.
---

# Figma component → code component

Input: a Figma URL/node of a component set, or a pattern already used in a real screen.

## 1. Check it doesn't already exist
Read `packages/ui/catalog.json`. If a similar component exists, propose a **new variant/prop** instead of a new component, and ask the human.

## 2. Read the design
Use the Figma MCP (`get_design_context`, `get_variable_defs`, `get_screenshot`) on the node.
Write down:
- Variant properties → become props (Figma `Variant=Primary` → `variant="primary"`, lowercase).
- Boolean/text/instance-swap properties → boolean/string/ReactNode props.
- Every fill, stroke, gap, padding and radius **must be bound to a variable**. If one isn't, stop and report it to the designer. Don't guess a value.

## 3. Build
- Folder: `packages/ui/src/components/<Name>/`
- `<Name>.tsx`: `cva` for variants, `cn()` for merging, `forwardRef` for DOM components. Token classes only.
  A Figma variable maps 1:1 to a class with the same name (`action-brand` fill → `bg-action-brand`, `content-on-brand` text →
  `text-content-on-brand`, `radius-md` → `rounded-md`, `space-12` padding → `px-12`). The full list is `packages/tokens/build/css/theme.css`.
  Overlays and complex interactive components → wrap the matching **Radix** primitive.
- JSDoc on the component (`/** Name — Figma: "<component set name>" ... */`) and on each prop. This becomes the catalog description.
- `<Name>.stories.tsx`: one story per variant + every state (hover via play fn optional, disabled, error, loading) + `parameters.design.url` = Figma URL.
- `<Name>.figma.tsx`: Code Connect mapping of the Figma properties.
- Export from `src/index.ts`.

## 4. Finish
```bash
pnpm --filter @tawan-design/ui catalog   # regenerate catalog.json
pnpm check
pnpm changeset                     # minor = new component/variant, patch = fix
```
Open a PR using the "New component" template. Include the Figma link and screenshots of the stories.
