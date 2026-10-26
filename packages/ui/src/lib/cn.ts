import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom token scales so conflicting classes resolve correctly
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ["0", "2", "4", "8", "12", "16", "20", "24", "32", "40", "48", "64"],
      radius: ["8", "12", "full"],
      text: ["12", "14", "16", "20", "24", "32"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
