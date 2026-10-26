import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-8 rounded-8 font-medium transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand text-fg-on-brand hover:bg-brand-hover",
        secondary: "border border-border bg-surface text-fg hover:bg-subtle",
        ghost: "bg-transparent text-fg hover:bg-muted",
        danger: "bg-danger text-fg-on-brand hover:opacity-90",
      },
      size: {
        sm: "h-32 px-12 text-14",
        md: "h-40 px-16 text-14",
        lg: "h-48 px-20 text-16",
      },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Visual style. Figma property "Variant". */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Height and padding. Figma property "Size". */
  size?: "sm" | "md" | "lg";
  /** Stretch to container width */
  fullWidth?: boolean;
  /** Render as the child element (e.g. a link) while keeping Button styles */
  asChild?: boolean;
}

/**
 * Button — Figma: "Button" component set.
 * Variants and sizes mirror the Figma variant properties 1:1.
 * One `primary` Button per view (see DESIGN.md).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} data-ds="Button" className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props} />;
  },
);
Button.displayName = "Button";
