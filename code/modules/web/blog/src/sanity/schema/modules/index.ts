import type { SchemaTypeDefinition } from "sanity";
import blogCategorySpotlight from "./blog-category-spotlight";
import blogCollection from "./blog-collection";
import blogExplore from "./blog-explore";
import blogFeatured from "./blog-featured";
import blogHero from "./blog-hero";
import blogIndex from "./blog-index";
import blogPostContent from "./blog-post-content";
import blogPostList from "./blog-post-list";

/**
 * Blog-specific page-builder modules — dispatched by the blog's `ModuleRenderer`,
 * not by the generic `BLOCK_RENDERERS`. The 16 generic modules live in
 * `@indiecrafts/packages-web-page-builder`.
 */
export const blogModuleSchemas: SchemaTypeDefinition[] = [
  blogCategorySpotlight,
  blogCollection,
  blogExplore,
  blogFeatured,
  blogHero,
  blogIndex,
  blogPostContent,
  blogPostList,
];

export const BLOG_MODULE_TYPES = [
  "module.blog-category-spotlight",
  "module.blog-collection",
  "module.blog-explore",
  "module.blog-featured",
  "module.blog-hero",
  "module.blog-index",
  "module.blog-post-content",
  "module.blog-post-list",
] as const;

export type BlogModuleType = (typeof BLOG_MODULE_TYPES)[number];
