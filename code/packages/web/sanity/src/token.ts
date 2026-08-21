import "server-only";

/**
 * Sanity read token — used by draft-mode + live preview to fetch unpublished
 * content. Issue at sanity.io/manage → API → Tokens (Viewer role is enough).
 *
 * Not required for the public blog to function — `pages/blog` reads through
 * the unauthenticated client. Only the draft-mode routes and `sanityFetch`
 * need it.
 */
export const token = process.env.SANITY_API_READ_TOKEN;

/**
 * Browser-exposed preview token — `defineLive`'s `browserToken` ships to the
 * client during draft mode. Prefer a dedicated, minimal-scope (Viewer) token so
 * the main read token never reaches the browser; falls back to `token` when
 * unset, so preview keeps working out of the box.
 */
export const previewToken = process.env.SANITY_API_PREVIEW_TOKEN ?? token;
