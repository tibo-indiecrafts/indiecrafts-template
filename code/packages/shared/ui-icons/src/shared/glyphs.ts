/**
 * The curated UI/nav icon-name set — the SINGLE source shared by the web + native
 * renderers AND the Sanity pickers. Names are lucide glyphs (kebab-case, which is
 * both the picker value and the lucide id). Extend the list here and every renderer
 * + picker follows. The original feature-grid 6 (zap · settings · sparkles · shield ·
 * globe · users) stay first for content compatibility.
 */
export const GLYPHS = [
  // feature-grid originals (do not reorder / rename — these are stored content)
  "zap",
  "settings",
  "sparkles",
  "shield",
  "globe",
  "users",
  // general UI
  "check",
  "star",
  "heart",
  "search",
  "mail",
  "phone",
  "calendar",
  "clock",
  "lock",
  "download",
  "external-link",
  "arrow-right",
  "chevron-right",
  "chevron-down",
  "menu",
  "x",
  "sun",
  "moon",
  "bell",
  "info",
  "file-text",
  "rocket",
] as const;

/** A valid icon name — the union the whole product types against. */
export type GlyphName = (typeof GLYPHS)[number];

/** True when a free-text string is a known glyph (narrows to `GlyphName`). */
export const isGlyph = (value: string): value is GlyphName =>
  (GLYPHS as readonly string[]).includes(value);

/** Title-case a kebab name for a picker label (`external-link` → "External link"). */
const titleize = (name: string): string =>
  name.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/**
 * Sanity string-field `options.list` derived from {@link GLYPHS} — the ONE place the
 * picker options come from, so a new glyph shows up in Studio with no hand-sync.
 * Pass a subset (e.g. the feature-grid originals) to offer only those.
 */
export const glyphOptions = (
  names: readonly GlyphName[] = GLYPHS,
): { title: string; value: GlyphName }[] =>
  names.map((value) => ({ title: titleize(value), value }));
