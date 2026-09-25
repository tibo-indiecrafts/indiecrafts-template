/**
 * Instantiate every next/font and expose the `<html>` font classes and style vars.
 *
 * @see docs/reference/projects/web/website/src/lib/fonts.md
 */
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import type { CSSProperties } from "react";
import { fonts, type FontKey } from "@/config";

/**
 * Font registry — the single place `next/font` is called.
 *
 * `next/font` needs statically-analyzable literal calls (you can't do
 * `google[name]()`), so every font is instantiated here and given its own
 * `--f-<key>` CSS variable. `config.fonts` then maps each role
 * (display/body/mono) to a key, and this module resolves that into:
 *
 *   - `fontClassName` — the `.variable` classes to put on `<html>` (only the
 *     fonts actually in use, deduped), which define the `--f-*` vars.
 *   - `fontStyle` — inline `<html>` style pointing `--font-display`/
 *     `--font-sans`/`--font-mono` at the chosen fonts' `--f-*` vars.
 *
 * Google fonts (Geist) are auto-subset + self-hosted + preloaded by Next.
 * Local fonts (Satoshi) are self-hosted from the shared brick
 * `@indiecrafts/packages-shared-ui-fonts` (`fonts/*.woff2`). All use
 * `display: "swap"` with the size-adjusted fallback Next generates.
 *
 * Add a font: drop the `.woff2` in `@indiecrafts/packages-shared-ui-fonts`,
 * register it below, then add its key to `FontKey` in the shared config.
 * The `satisfies` check keeps the two in lockstep.
 */

const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--f-geist" });

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--f-geist-mono",
});

// Local (self-hosted) variable font — the showcase for the local pipeline.
// Files in `@indiecrafts/packages-shared-ui-fonts`; add a `localFont(...)` call
// + a `FontKey`, and it's selectable in `config.fonts` like a Google font.
const satoshi = localFont({
  // Files live in @indiecrafts/packages-shared-ui-fonts (shared design brick);
  // next/font needs a static-literal path, so this is a relative path (not an import).
  src: [
    {
      path: "../../../../../../packages/shared/ui-fonts/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../../../../../../packages/shared/ui-fonts/fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--f-satoshi",
});

const REGISTRY = {
  geist,
  "geist-mono": geistMono,
  satoshi,
} satisfies Record<FontKey, { variable: string }>;

/** `.variable` classes for the fonts in use (deduped) → put on `<html>`. */
export const fontClassName = [...new Set([fonts.display, fonts.body, fonts.mono])]
  .map((key) => REGISTRY[key].variable)
  .join(" ");

/** Inline `<html>` style mapping each role var to its chosen font. */
export const fontStyle: CSSProperties = {
  "--font-display": `var(${REGISTRY[fonts.display].variable})`,
  "--font-sans": `var(${REGISTRY[fonts.body].variable})`,
  "--font-mono": `var(${REGISTRY[fonts.mono].variable})`,
} as CSSProperties;
