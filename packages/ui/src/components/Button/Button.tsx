import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { buttonBase, buttonColors, type ButtonTone, type ButtonVariant } from "./buttonColors";

// Figma: padding space-12 × space-8/10/12, gap space-4, radius sm/md, text Button/SM·MD·LG (semibold),
// icon slots icon-sm/md/lg. Heights 32 / 40 / 48 = control-sm / md / lg.
const sizes = {
  small: "gap-4 px-12 py-8 rounded-sm text-label-sm font-semibold *:data-[slot=icon]:size-icon-sm",
  medium: "gap-4 px-12 py-10 rounded-md text-label-md font-semibold *:data-[slot=icon]:size-icon-md",
  large: "gap-4 px-12 py-12 rounded-md text-label-lg *:data-[slot=icon]:size-icon-lg",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma "Variant". Filled for the single primary action; Tonal, Outline, Ghost for less emphasis. */
  variant?: ButtonVariant;
  /** Figma "Tone". Danger only for destructive actions. */
  tone?: ButtonTone;
  /** Figma "Size": small 32px · medium 40px · large 48px. */
  size?: keyof typeof sizes;
  /** Figma "Show left icon" + "Left icon". Pass an `<Icon />`; its size and color are set for you. */
  leftIcon?: ReactNode;
  /** Figma "Show right icon" + "Right icon". Pass an `<Icon />`; its size and color are set for you. */
  rightIcon?: ReactNode;
}

/**
 * Button — Figma: "Button" (BASED COMPONENTS → Button).
 * Figma "Label" is the children. Figma "State" is handled by the browser: hover, pressed (active),
 * focus (keyboard, 2px focus ring) and `disabled`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "filled", tone = "brand", size = "small", leftIcon, rightIcon, className, type = "button", children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      data-ds="Button"
      className={cn(buttonBase, buttonColors[variant][tone], sizes[size], className)}
      {...props}
    >
      {leftIcon && <span data-slot="icon" className="inline-flex *:size-full">{leftIcon}</span>}
      {children}
      {rightIcon && <span data-slot="icon" className="inline-flex *:size-full">{rightIcon}</span>}
    </button>
  ),
);
Button.displayName = "Button";
