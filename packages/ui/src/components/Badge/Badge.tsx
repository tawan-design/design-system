import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

export const badgeVariants = cva("inline-flex items-center gap-4 rounded-full px-8 py-2 text-12 font-medium", {
  variants: {
    tone: {
      neutral: "bg-muted text-fg-muted",
      brand: "bg-brand-soft text-fg-brand",
      success: "bg-success-soft text-fg-success",
      danger: "bg-danger-soft text-fg-danger",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Status meaning. Figma property "Tone". */
  tone?: "neutral" | "brand" | "success" | "danger";
}

/** Badge — Figma: "Badge" component set. Use for status, never for actions. */
export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span data-ds="Badge" className={cn(badgeVariants({ tone }), className)} {...props} />;
}
