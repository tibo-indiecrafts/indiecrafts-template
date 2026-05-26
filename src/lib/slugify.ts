/**
 * Heading slugifier — used by the PortableText renderer to give each
 * `<h2>` / `<h3>` an `id` and by the Table of Contents to link to it.
 * Deterministic, ASCII-only, hyphen-joined.
 */
export function slugify(text: string): string {
  return (
    text
      .toString()
      .normalize("NFKD")
      // strip diacritics
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
  );
}
