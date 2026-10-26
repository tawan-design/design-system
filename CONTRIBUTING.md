# Contributing

Anyone can propose. The Design System team decides and merges.

## The flow (same for designers and engineers)

```
 Figma ──▶ branch ──▶ PR ──▶ preview + checks ──▶ review ──▶ merge to main ──▶ release PR ──▶ npm version
                              (auto)              (Design + Eng)                (Design merges)   (Eng upgrades)
```

1. **Start from an issue.** Use a template (new component, token change, bug). Small fixes can skip this.
2. **Branch.** `feat/date-picker`, `tokens/warning-color`, `fix/button-focus`.
   Designers: ask Claude to do it ("create a branch for the DatePicker component").
3. **Build.** Use the matching skill: `ds-component-from-figma`, `ds-tokens-sync`, or `ds-build-screen`.
4. **Changeset.** `pnpm changeset` → pick `patch` (fix), `minor` (new component/variant/token), `major` (rename/removal).
5. **Open a PR.** Fill in the template. CI runs typecheck + raw-value audit + build. Chromatic publishes a Storybook preview.
6. **Review.**
   - **Designers** open the Storybook preview link and approve visual changes in Chromatic. No code reading needed.
   - **Engineers** review code quality, API shape and accessibility.
   - CODEOWNERS makes Design approval mandatory for tokens, DESIGN.md and components.
7. **Merge** to `main` (squash). Storybook on `main` = the live docs.
8. **Release.** Changesets keeps a "Release: version packages" PR open. When the DS team merges it, a new version is published and `CHANGELOG.md` updates.
9. **Adopt.** Product engineers run `pnpm up @tawan-design/ui` in their app when they're ready, reading the changelog first.

## Who does what

| | Designers | DS team (owners) | Engineers |
|---|---|---|---|
| Propose (issue/PR) | ✅ | ✅ | ✅ |
| Change tokens | via Figma → `ds-tokens-sync` PR | approve | – |
| Build components | ✅ with Claude | approve | ✅ |
| Review visuals | ✅ (Chromatic) | ✅ required | optional |
| Review code | – | ✅ | ✅ required on `packages/ui/src` |
| Merge + release | – | ✅ | – |

## Rules
- Never push to `main` directly (branch protection).
- One component or one token change per PR. Small PRs get reviewed fast.
- Eval output (`evals/`) never merges.
