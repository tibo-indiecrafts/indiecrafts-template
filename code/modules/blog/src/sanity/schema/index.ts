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
// entities now live in @indiecrafts/page-builder (registered via pageBuilderSanity);
// blog references them by type name. `metadata` is post-specific, stays here.
import metadata from "./objects/metadata";

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
  metadata,
  // Blog modules
  ...blogModuleSchemas,
];
