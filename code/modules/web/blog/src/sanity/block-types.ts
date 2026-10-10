/**
 * Name the blog blocks that describe the post being read — a runtime constant, free of schema code.
 *
 * @see docs/reference/modules/web/blog/src/sanity/block-types.md
 */

/**
 * Blocks that describe the post being read: they render nothing on any other page. Kept
 * out of `schema/modules` so the site's runtime imports no Sanity schema code.
 */
export const POST_ONLY_TYPES: ReadonlySet<string> = new Set([
  "module.blog-toc",
  "module.blog-related",
  "module.blog-post-content",
]);
