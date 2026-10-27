import { forwardRef, type SVGProps } from "react";
import { cn } from "../../lib/cn";
import data from "./icons.json";

export type IconName = keyof typeof data.icons;

const sizes = {
  xs: "size-icon-xs",
  sm: "size-icon-sm",
  md: "size-icon-md",
  lg: "size-icon-lg",
} as const;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref" | "name"> {
  /** Icon name: the Figma icon name in kebab case (Figma "Edit / Add_Plus" → `add-plus`). */
  name: IconName;
  /** Size token: `icon-xs` 12 · `icon-sm` 16 · `icon-md` 20 · `icon-lg` 24. Inside Button and Icon Button the size is set for you. */
  size?: keyof typeof sizes;
  /** Accessible name. Leave empty for decorative icons (next to text); they are hidden from screen readers. */
  label?: string;
}

/**
 * Icon — Figma: "Icon" page, Coolicon set.
 * Takes the color of the surrounding text (`currentColor`), so set color with `text-content-*` / `text-icon-*`
 * on the icon or its parent.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(({ name, size = "md", label, className, ...props }, ref) => {
  const icon = data.icons[name];
  return (
    <svg
      ref={ref}
      data-ds="Icon"
      viewBox={data.viewBox}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("shrink-0", sizes[size], className)}
      {...props}
    >
      {icon.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
});
Icon.displayName = "Icon";

// Every icon available in code. Icons are exported from Figma on demand (see icons.json).
export const iconNames = Object.keys(data.icons) as IconName[];
