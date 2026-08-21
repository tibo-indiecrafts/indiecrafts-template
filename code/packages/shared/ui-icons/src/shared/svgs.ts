/**
 * Custom SVG registry — project-specific marks that aren't in lucide/reicon (a logo
 * mark, a bespoke glyph). Pure path DATA (24×24-ish, `fill: currentColor`), so the
 * web (`<svg>`) and native (`react-native-svg`) renderers draw one source — fully
 * cross-platform, unlike reicon (web-only). Drop your own `{ viewBox, path }` here.
 */

export type SvgMark = {
  /** SVG viewBox, e.g. `"0 0 24 24"`. */
  viewBox: string;
  /** A single path, `fill: currentColor`. */
  path: string;
};

export const SVGS = {
  /** Placeholder mark — replace with your brand's, add more alongside it. */
  "logo-mark": { viewBox: "0 0 24 24", path: "M12 2 L22 20 L2 20 Z" },
} as const satisfies Record<string, SvgMark>;

/** A registered custom-SVG name. */
export type SvgName = keyof typeof SVGS;

/** True when a string is a registered custom SVG (narrows to `SvgName`). */
export const isSvg = (value: string): value is SvgName => value in SVGS;
