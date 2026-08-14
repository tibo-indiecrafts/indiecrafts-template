/**
 * Shared pagination math for the blog listings (category / tag / author
 * detail). Kept tiny + framework-free so both the route (range → GROQ) and
 * the `<Pager>` (page count → links) read the same source.
 */

/** Posts per page across every paginated blog listing. */
export const POSTS_PER_PAGE = 12;

/** A `?page=` value → a 1-based page number (>= 1; junk falls back to 1). */
export function parsePage(raw: string | string[] | undefined): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(n) && n > 1 ? n : 1;
}

/** GROQ slice bounds for a page — `[start...end]`, end exclusive. */
export function pageRange(page: number): { start: number; end: number } {
  const start = (page - 1) * POSTS_PER_PAGE;
  return { start, end: start + POSTS_PER_PAGE };
}

/** Total number of pages for `total` items (never below 1). */
export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}
