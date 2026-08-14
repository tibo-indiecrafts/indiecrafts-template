/**
 * Theme + fonts. Color tokens themselves are oklch in `globals.css` (the
 * authoritative source); only the PWA-manifest hex mirror + the container widths +
 * the font-role pairing + the theme-availability flags live here as code.
 */

import type { FontRoles, ThemeName } from "./types";

export const theme = {
  /**
   * Hex mirror of the oklch `background` token — the one color the PWA
   * manifest (`app/manifest.ts` → `theme_color` / `background_color`) needs,
   * since the manifest spec can't take oklch. Everything else reads oklch
   * straight from `globals.css` (the authoritative color source) via Tailwind
   * utilities. Keep this value matched to `--background` in globals.css.
   */
  hexColors: {
    background: "#ffffff",
  },
  container: { maxWidth: "1280px", gutter: "1rem" },
} as const;

/**
 * Active font pairing — one registered font (see `@/lib/fonts`) per role.
 *
 * `next/font` requires its loader calls to be static literals, so the fonts
 * themselves live in the registry; this just picks which plays each role.
 * `display` drives headings (`--font-display`); set it equal to `body` for a
 * single-typeface look. Swapping the whole pairing is a one-line edit here.
 *
 * Ships a display/body split: Satoshi (self-hosted local variable font) for
 * headings, Geist (Google, auto-subset + self-hosted) for body, Geist Mono
 * for code. Add a font → extend `FontKey` + the registry, then name it here.
 */
export const fonts = {
  display: "satoshi",
  body: "geist",
  mono: "geist-mono",
} as const satisfies FontRoles;

/**
 * Theme availability — which color modes the site offers and whether it's
 * locked to one. Consumed via `@/lib/theme`, which turns these flags into
 * next-themes provider props and decides whether the toggle renders.
 *
 * Common setups:
 *   - Light + dark + system (default):  { light: true,  dark: true,  system: true,  forced: null }
 *   - Light only (no toggle):           { light: true,  dark: false, system: false, forced: null }
 *   - Locked to dark (no toggle):       {                                            forced: "dark" }
 *
 * `forced` wins over everything: it paints one theme site-wide and hides the
 * toggle. Otherwise the toggle offers `light`/`dark` (whichever are on), plus
 * a "System" (follow-OS) option when `system` is on AND both themes exist.
 * The toggle auto-hides whenever only one option remains.
 */
export const themeConfig: {
  light: boolean;
  dark: boolean;
  system: boolean;
  forced: ThemeName | null;
} = {
  light: true,
  dark: true,
  system: true,
  forced: null,
};
