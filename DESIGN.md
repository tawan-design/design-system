---
owner: Design lead (Tawan)
last_reviewed: 2026-10-25
scope: Intent and judgment. Values live in packages/tokens, components in packages/ui/catalog.json.
---

# DESIGN.md: the "why"

This file explains **intent**. It never lists token values or component props.
Those are generated elsewhere (see `AGENTS.md`). If you find a hex code here, delete it.

## Product personality

<!-- TODO(owner): replace with your product's voice -->
- **Calm and trustworthy.** This is money. Prefer clarity over delight on any screen that moves funds.
- **Quietly confident.** One primary action per view. Everything else is secondary or ghost.
- **Delight lives in the edges**: empty states, success moments, onboarding illustrations. Never in forms.

## Color intent

- `action-brand` is for the **single primary action** on a screen. Two brand buttons on one view is a smell.
- `danger` is only for destructive or failed states, never for emphasis.
- Status = `Badge` tones. Don't color text to show status.
- Every screen must work in Light and Dark. Never assume a white background.

## Layout and spacing

- The spacing scale is 0–96 (`space-*`). Default rhythm: `gap-16` between related items, `gap-24` between sections, `p-20`/`p-24` inside cards.
- Radius: `rounded-md` for controls (buttons, inputs), `rounded-lg` for containers (cards, dialogs), `rounded-pill` for pills and avatars.

## Patterns

### Money movement (transfer, payment, withdrawal)
1. Form → 2. **Review dialog** restating amount + recipient + "can't be undone" → 3. Success state.
Never skip the review step. The Confirm button sits on the right, Cancel on the left.

### Forms
- Labels are always visible (no placeholder-only inputs).
- Validate on blur or on submit, not on every keystroke. Error text says how to fix it ("Enter an amount greater than 0").
- Disable the primary button until the form is valid **and** explain why if it isn't obvious.

### Empty states
<!-- TODO(owner) -->

## Accessibility baseline

- WCAG 2.1 AA contrast for all text and token pairs.
- Every interactive element is keyboard reachable with a visible focus ring (`focus-ring`, width `border-focus-ring-width`).
- Touch targets ≥ 40px (`h-control-md`).

## Do / Don't

| Do | Don't |
|---|---|
| Compose existing components | Hand-roll a lookalike |
| Ask for a new variant via issue | Override styles with `className` to fake a variant |
| Use `Badge` for status | Color plain text red/green |
