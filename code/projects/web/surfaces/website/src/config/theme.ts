/**
 * Theme + fonts availability — **this app's** design identity. Color tokens
 * themselves are oklch in `globals.css` (the authoritative source); only the
 * PWA-manifest hex mirror + the container widths + the theme-availability flags
 * live here as code. App-owned (a second app ships its own look), so this is in
 * `apps/web/src/config`, not the shared `@indiecrafts/packages-shared-config` primitives.
 */

import type { ThemeName } from "@indiecrafts/packages-shared-config";
import { hexColors as tokenHex } from "@indiecrafts/packages-web-ui-tokens/hex";

export const theme = {
  /**
   * Hex mirror of the oklch `background` token — the one color the PWA manifest
   * (`app/manifest.ts` → `theme_color` / `background_color`) needs, since the
   * manifest spec can't take oklch. **Generated** from `ui-tokens/src/shared/tokens.json`
   * (DTCG) via `pnpm tokens:build` — no manual sync with `globals.css` (the old
   * "keep both matched" trap is gone). Everything else reads oklch via Tailwind utilities.
   */
  hexColors: {
    background: tokenHex.light.background,
  },
  container: { maxWidth: "1280px", gutter: "1rem" },
} as const;

/**
 * Theme availability — which color modes the site offers and whether it's
 * locked to one. Consumed via `@/lib/theme`, which turns these flags into
 * next-themes provider props and decides whether the toggle renders.
 *
 * Common setups:
 *   - Light + dark (default):   { light: true,  dark: true,  forced: null }
 *   - Light only (no toggle):   { light: true,  dark: false, forced: null }
 *   - Locked to dark (no toggle): {                          forced: "dark" }
 *
 * `forced` wins over everything: it paints one theme site-wide and hides the
 * toggle. Otherwise the toggle offers `light`/`dark` (whichever are on), and
 * the site **auto-detects the OS theme on first load** (follow `prefers-color-scheme`)
 * whenever both are offered — there is no "System" menu option; auto-detect is the
 * default behaviour. The toggle auto-hides whenever only one option remains.
 */
export const themeConfig: {
  light: boolean;
  dark: boolean;
  forced: ThemeName | null;
} = {
  light: true,
  dark: true,
  forced: null,
};
