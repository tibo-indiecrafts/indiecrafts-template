/**
 * Theme tokens — drives CSS variables injected in globals.css.
 *
 * Values here are duplicated in globals.css (as `oklch(...)` for runtime
 * CSS). When rebranding, update BOTH in the same commit — the contrast
 * checker (`pnpm verify:contrast`) reads the CSS, not this file.
 *
 * Validated via Zod so typos in oklch strings surface at boot, not at paint.
 */

import { z } from "zod";

const oklch = z
  .string()
  .regex(
    /^oklch\(\s*[\d.]+\s+[\d.]+\s+[\d.]+\s*\)$/,
    "Expected an oklch(lightness chroma hue) string",
  );

const ThemeSchema = z.object({
  /**
   * Hex mirrors of the CSS oklch colors — required because Satori
   * (next/og) does not understand oklch. Used only by app/icon.tsx,
   * apple-icon.tsx, opengraph-image.tsx.
   */
  hexColors: z.object({
    brand: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    brandForeground: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    foreground: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
  colors: z.object({
    brand: oklch,
    brandForeground: oklch,
    background: oklch,
    foreground: oklch,
    muted: oklch,
    mutedForeground: oklch,
    destructive: oklch,
    border: oklch,
    ring: oklch,
  }),
  fonts: z.object({
    sans: z.string(),
    mono: z.string(),
  }),
  radii: z.object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
  }),
  container: z.object({
    maxWidth: z.string(),
    gutter: z.string(),
  }),
});

export type ThemeConfig = z.infer<typeof ThemeSchema>;

export const themeConfig = ThemeSchema.parse({
  hexColors: {
    brand: "#4f69d9",
    brandForeground: "#ffffff",
    background: "#ffffff",
    foreground: "#171717",
  },
  colors: {
    brand: "oklch(0.55 0.18 260)",
    brandForeground: "oklch(0.985 0 0)",
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    muted: "oklch(0.97 0 0)",
    mutedForeground: "oklch(0.556 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.84 0 0)",
    ring: "oklch(0.55 0.18 260)",
  },
  fonts: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
  radii: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  container: {
    maxWidth: "1280px",
    gutter: "1rem",
  },
} satisfies ThemeConfig);
