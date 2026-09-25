/**
 * Collect every blog schema type into one array for the Studio.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/index.md
 */
import type { SchemaTypeDefinition } from "sanity";

// Documents
import author from "./author";
import blog from "./documents/blog";
import category from "./category";
import tag from "./tag";
import series from "./series";
import post from "./post";
import comment from "./documents/comment";

// Reusable objects. `blockContent` · `cta` · `link` and the `quote`/`person`
// entities now live in @indiecrafts/packages-web-page-builder (registered via pageBuilderSanity);
// blog references them by type name. `postMedia` (slug + cover) is post-specific;
// post SEO uses the shared `seoMeta` (@indiecrafts/packages-web-schema) like every other doc.
import postMedia from "./objects/post-media";

// Blog-specific page-builder modules (blog-index · blog-post-content · blog-post-list)
import { blogModuleSchemas } from "./modules";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  blog,
  post,
  author,
  category,
  tag,
  series,
  comment,
  // Reusable objects
  postMedia,
  // Blog modules
  ...blogModuleSchemas,
];
