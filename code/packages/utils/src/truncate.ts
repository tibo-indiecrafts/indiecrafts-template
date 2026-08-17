/**
 * Truncate `text` to at most `maxLength` characters, breaking on the last word
 * boundary so a word is never cut mid-way, and appending an ellipsis. Returns
 * the text unchanged when it already fits.
 */
export function truncateText(text: string, maxLength: number, ellipsis = "..."): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength - ellipsis.length);
  const lastSpace = truncated.lastIndexOf(" ");
  const body = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
  return body + ellipsis;
}
