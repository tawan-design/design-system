---
name: ds-component-from-figma
description: Use when turning a Figma component or a proven pattern into a new (or updated) design system component in packages/ui. Covers variants, props, token bindings, story, Code Connect and catalog.
---

# Figma component → code component

Input: a Figma URL/node of a component set, or a pattern already used in a real screen.

## 1. Check it doesn't already exist
Read `packages/ui/catalog.json`. If a similar component exists, propose a **new variant/prop** instead of a new component, and ask the human.

## 2. Read the design
Use the Figma MCP on the component set. For big sets, a read-only `use_figma` script that tabulates the variable bound
to every fill, stroke, padding, gap and radius per variant is faster and more complete than screenshots
(set `figma.skipInvisibleInstanceChildren = false` so hidden icon slots are included).
Write down:
- Variant properties → become props, same name, lowercase values (Figma `Variant=Filled` → `variant="filled"`, `Size=XS` → `size="xs"`).
  If a Figma property name collides with an HTML attribute (e.g. `Type` on a button), propose renaming it **in Figma**.
- Boolean + instance-swap pairs ("Show left icon" + "Left icon") → one `ReactNode` prop (`leftIcon`). Text → `children` or a string prop.
- Code defaults = Figma defaults (the component set's default variant).
- Every fill, stroke, gap, padding and radius **must be bound to a semantic variable**. If one isn't (raw value, or a primitive),
  stop and report it to the designer, with the fix. Also report inconsistencies between states (e.g. a Focus state that
  changes the fill). Fix in Figma first, with the designer's OK, then build.

## 3. Build
- Folder: `packages/ui/src/components/<Name>/`
- `<Name>.tsx`: `cva` for variants, `cn()` for merging, `forwardRef` for DOM components. Token classes only.
  A Figma variable maps 1:1 to a class with the same name (`action-brand` fill → `bg-action-brand`, `content-on-brand` text →
  `text-content-on-brand`, `radius-md` → `rounded-md`, `space-12` padding → `px-12`). The full list is `packages/tokens/build/css/theme.css`.
  Overlays and complex interactive components → wrap the matching **Radix** primitive.
- Conventions (set by Button, follow them everywhere):
  - Figma `State` is **not a prop**: Hover → `enabled:hover:`, Pressed → `enabled:active:`, Disabled → `disabled` attribute +
    `disabled:` classes, Focus → `focus-visible:focus-ring` (the shared 2px outside ring from `styles.css`). Only real
    product states (`error`, `loading`…) become props, and only if Figma has them.
  - Figma strokes are drawn **inside**: use `inset-ring inset-ring-border-*`, not `border`, so sizes match Figma exactly.
  - Icons inherit the text color (`currentColor`). Size icons from the parent (`*:size-icon-*`), never per usage.
  - Add `data-ds="<Name>"` on the root element (used by design QA).
  - Share color maps between sibling components (Button and Icon Button share `buttonColors.ts`).
- Icons: only icons already in `src/components/Icon/icons.json` exist. To add one, export it from the Figma Icon page
  (`exportAsync({ format: "SVG_STRING" })`), add `{ figma, id, paths }` under its kebab-case name, and verify the
  paths against Figma with a checksum before committing.
- JSDoc on the component (`/** Name — Figma: "<component set name>" ... */`) and on each prop. This becomes the catalog description.
- `<Name>.stories.tsx`: one story per variant + every state (disabled, error, loading) + `parameters.design.url` = Figma URL.
  Add `chromatic: { modes: { light: { theme: "light" }, dark: { theme: "dark" } } }` so both themes are reviewed.
  Show Focus statically with `className="focus-ring"` (focus-visible can't be triggered by a script).
- Verify before the PR: build Storybook and measure the rendered component (height, padding, radius, icon size, colors)
  against the Figma values. They must match exactly.
- `<Name>.figma.tsx`: Code Connect mapping of the Figma properties.
- Export from `src/index.ts`.

## 4. Finish
```bash
pnpm --filter @tawan-design/ui catalog   # regenerate catalog.json
pnpm check
pnpm changeset                     # minor = new component/variant, patch = fix
```
Open a PR using the "New component" template. Include the Figma link and screenshots of the stories.
