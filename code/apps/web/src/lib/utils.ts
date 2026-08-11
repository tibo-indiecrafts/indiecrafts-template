import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Conditional + conflict-free Tailwind class merger. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
