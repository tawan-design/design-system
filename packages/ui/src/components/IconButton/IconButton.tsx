import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { buttonBase, buttonColors, type ButtonTone, type ButtonVariant } from "../Button/buttonColors";

// Figma: padding space-4/4/8/12 around an icon-sm (xs) or icon-lg icon → 24 / 32 / 40 / 48.
const sizes = {
  xs: "p-4 *:size-icon-sm",
  small: "p-4 *:size-icon-lg",
  medium: "p-8 *:size-icon-lg",
  large: "p-12 *:size-icon-lg",
} as const;
// Figma: Square uses radius-sm (xs, small) and radius-md (medium, large); Circle uses radius-pill.
const squareRadius = { xs: "rounded-sm", small: "rounded-sm", medium: "rounded-md", large: "rounded-md" } as const;

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Figma "Icon". Pass an `<Icon />`; its size and color are set for you. */
  icon: ReactNode;
  /** What the button does, read by screen readers (there is no visible label). Required. */
  "aria-label": string;
  /** Figma "Shape". */
  shape?: "square" | "circle";
  /** Figma "Variant". */
  variant?: ButtonVariant;
  /** Figma "Tone". Danger only for destructive actions. */
  tone?: ButtonTone;
  /** Figma "Size": xs 24px · small 32px · medium 40px · large 48px. */
  size?: keyof typeof sizes;
}

/**
 * Icon Button — Figma: "Icon Button" (BASED COMPONENTS → Icon Button).
 * Same Variant/Tone colors as Button. Figma "State" is handled by the browser: hover, pressed, focus, `disabled`.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, shape = "square", variant = "filled", tone = "brand", size = "small", className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      data-ds="IconButton"
      className={cn(
        buttonBase,
        buttonColors[variant][tone],
        sizes[size],
        shape === "circle" ? "rounded-pill" : squareRadius[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  ),
);
IconButton.displayName = "IconButton";
