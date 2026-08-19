/**
 * Title highlight parser — the platform-agnostic half of `RichTitle`.
 *
 * Splits a title string into plain and highlighted segments on the `[[word]]`
 * marker. The marker is safe inside next-intl/ICU messages AND Sanity strings,
 * so one parser serves both the app and the CMS. A string with no marker yields
 * a single plain segment, so wrapping any existing title is a no-op.
 */

export type TitleSegment = { text: string; highlight: boolean };

// `[[...]]` around one or more non-`]` chars. Unmatched `[[` (no close) and an
// empty `[[]]` never match, so they render as literal text — no throw.
const HIGHLIGHT_RE = /\[\[([^\]]+)\]\]/g;

/** Split a title into ordered plain + highlighted segments. */
export function splitHighlights(input: string): TitleSegment[] {
  const segments: TitleSegment[] = [];
  let last = 0;
  for (const match of input.matchAll(HIGHLIGHT_RE)) {
    const index = match.index ?? 0;
    const full = match[0] ?? "";
    const word = match[1] ?? "";
    if (index > last) {
      segments.push({ text: input.slice(last, index), highlight: false });
    }
    segments.push({ text: word, highlight: true });
    last = index + full.length;
  }
  if (last < input.length) {
    segments.push({ text: input.slice(last), highlight: false });
  }
  return segments;
}
