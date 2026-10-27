// Colors for Button and Icon Button, from the Figma variable bindings of every
// Variant × Tone × State. Figma's Hover / Pressed / Disabled / Focus states map to
// enabled:hover / enabled:active / disabled / focus-visible. Icons inherit the text color.
// Figma strokes are drawn INSIDE the button, so they are inset rings (no effect on size), not CSS borders.
export type ButtonVariant = "filled" | "tonal" | "ghost" | "outline";
export type ButtonTone = "brand" | "danger" | "neutral";

const disabledFilled = "disabled:bg-action-brand-disabled disabled:text-content-disabled";
const disabledSubtle = "disabled:bg-action-neutral-disabled disabled:text-content-disabled";
const disabledGhost = "disabled:bg-action-ghost disabled:text-content-disabled";
const disabledOutline = "disabled:bg-transparent disabled:inset-ring-border-disabled disabled:text-content-disabled";

export const buttonColors: Record<ButtonVariant, Record<ButtonTone, string>> = {
  filled: {
    brand: `bg-action-brand text-content-on-brand enabled:hover:bg-action-brand-hover enabled:active:bg-action-brand-pressed ${disabledFilled}`,
    danger: `bg-action-danger text-content-on-brand enabled:hover:bg-action-danger-hover enabled:active:bg-action-danger-pressed ${disabledFilled}`,
    neutral:
      "bg-action-neutral text-content-invert enabled:hover:bg-action-neutral-hover enabled:active:bg-action-neutral-pressed " +
      "disabled:bg-action-neutral-disabled disabled:text-content-disabled",
  },
  tonal: {
    brand: `bg-action-brand-subtle text-content-brand enabled:hover:bg-action-brand-subtle-hover enabled:active:bg-action-brand-subtle-pressed ${disabledSubtle}`,
    danger: `bg-action-danger-subtle text-content-danger enabled:hover:bg-action-danger-subtle-hover enabled:active:bg-action-danger-subtle-pressed ${disabledSubtle}`,
    neutral:
      "inset-ring inset-ring-border-default bg-action-neutral-subtle text-content-secondary " +
      "enabled:hover:inset-ring-border-subtle enabled:hover:bg-action-neutral-subtle-hover " +
      "enabled:active:inset-ring-border-subtle enabled:active:bg-action-neutral-subtle-pressed " +
      `disabled:inset-ring-border-disabled ${disabledSubtle}`,
  },
  ghost: {
    brand: `bg-action-ghost text-content-brand enabled:hover:bg-action-brand-subtle enabled:active:bg-action-brand-subtle-hover ${disabledGhost}`,
    danger: `bg-action-ghost text-content-danger enabled:hover:bg-action-danger-subtle enabled:active:bg-action-danger-subtle-hover ${disabledGhost}`,
    neutral: `bg-action-ghost text-content-secondary enabled:hover:bg-action-ghost-hover enabled:active:bg-action-ghost-pressed ${disabledGhost}`,
  },
  outline: {
    brand: `inset-ring inset-ring-border-brand bg-transparent text-content-brand enabled:hover:bg-action-brand-subtle-hover enabled:active:bg-action-brand-subtle-pressed ${disabledOutline}`,
    danger: `inset-ring inset-ring-border-danger bg-transparent text-content-danger enabled:hover:bg-action-danger-subtle-hover enabled:active:bg-action-danger-subtle-pressed ${disabledOutline}`,
    neutral: `inset-ring inset-ring-border-default bg-transparent text-content-primary enabled:hover:bg-action-neutral-subtle-hover enabled:active:bg-action-neutral-subtle-pressed ${disabledOutline}`,
  },
};

/** Shared by every button-like component: focus ring and disabled cursor. */
export const buttonBase =
  "inline-flex shrink-0 items-center justify-center transition-colors select-none " +
  "focus-visible:focus-ring disabled:cursor-not-allowed";
