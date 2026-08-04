import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes without specificity fights.
 * Standard shadcn/ui helper — 21st.dev components expect it at "@/lib/utils".
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation — used by the cursor-tracking work list. */
export function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}

/** Zero-pad an index for editorial numbering: 1 -> "01". */
export function pad(n: number, width = 2) {
  return String(n).padStart(width, "0");
}
