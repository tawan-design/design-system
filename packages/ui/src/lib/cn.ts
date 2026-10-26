import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our token scales (generated in @tawan-design/tokens/theme.css),
// so conflicting classes resolve correctly. Without the type roles, text-body-md (size)
// and text-content-primary (color) would be treated as conflicts and one would be dropped.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        "0", "2", "4", "6", "8", "10", "12", "14", "16", "20", "24", "32", "40", "48", "64", "80", "96",
        "control-sm", "control-md", "control-lg", "icon-xs", "icon-sm", "icon-md", "icon-lg",
        "avatar-sm", "avatar-md", "avatar-lg",
      ],
      radius: ["sm", "md", "lg", "xl", "xxl", "pill"],
      text: [
        "body-sm", "body-md", "body-lg", "label-sm", "label-md", "label-lg",
        "heading-xs", "heading-sm", "heading-md", "heading-lg", "heading-xl", "code-sm", "code-md",
      ],
      font: ["primary", "display", "mono"],
      "font-weight": ["regular", "medium", "semibold", "bold"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
