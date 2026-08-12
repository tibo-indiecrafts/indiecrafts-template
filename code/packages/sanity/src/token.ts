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
