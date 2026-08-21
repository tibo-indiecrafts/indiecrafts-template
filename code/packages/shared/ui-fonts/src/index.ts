/**
 * `@indiecrafts/packages-shared-ui-fonts` — the self-hosted font FILES + their
 * metadata, centralized so every surface ships from one place (a design-system
 * brick like `ui-tokens`). The **files** live in `../fonts/`; this module is the
 * registry describing them.
 *
 * `next/font` requires **static-literal** loader calls, so the web app keeps its
 * `localFont(...)` in `src/lib/fonts.ts` and points `src.path` at this brick's
 * `../fonts/*.woff2` (a relative path — not a JS import). A native (Expo) app loads
 * the same `.woff2` via `expo-font`. Google fonts (Geist) stay loaded by the app.
 *
 * `FontKey`/`FontRoles` **types** live in `@indiecrafts/packages-shared-config`
 * (config vocabulary); this brick owns the *files* those keys resolve to.
 */

/** A self-hosted font file: path (relative to this package root) + the CSS descriptors. */
export type FontFile = {
  /** Path relative to the package root (`packages/shared/ui-fonts/`). */
  path: string;
  weight: string;
  style: "normal" | "italic";
};

/**
 * Self-hosted font files by `FontKey`. Google-served families (e.g. Geist) are not
 * here — they carry no file. Reference for `localFont`/`expo-font` wiring + docs.
 */
export const FONT_FILES = {
  satoshi: [
    { path: "fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
    {
      path: "fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
} as const satisfies Record<string, readonly FontFile[]>;
