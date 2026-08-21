/**
 * Active font pairing — one registered font (see `@/lib/fonts`) per role.
 * App-owned design config (a second app ships its own typography).
 *
 * `next/font` requires its loader calls to be static literals, so the fonts
 * themselves live in the registry (`@/lib/fonts`); this just picks which plays
 * each role. `display` drives headings (`--font-display`); set it equal to
 * `body` for a single-typeface look. Swapping the whole pairing is a one-line
 * edit here.
 *
 * Ships a display/body split: Satoshi (self-hosted local variable font) for
 * headings, Geist (Google, auto-subset + self-hosted) for body, Geist Mono
 * for code. Add a font → extend `FontKey` (in `@indiecrafts/packages-shared-config`) + the
 * registry, then name it here.
 */

import type { FontRoles } from "@indiecrafts/packages-shared-config";

export const fonts = {
  display: "satoshi",
  body: "geist",
  mono: "geist-mono",
} as const satisfies FontRoles;
