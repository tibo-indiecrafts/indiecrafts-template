/**
 * Collect the blog-specific module schemas and their type names.
 *
 * @see docs/reference/modules/web/blog/src/sanity/schema/modules/index.md
 */
import type { SchemaTypeDefinition } from "sanity";
import blogCategorySpotlight from "./blog-category-spotlight";
import blogCollection from "./blog-collection";
import blogExplore from "./blog-explore";
import blogFeatured from "./blog-featured";
import blogHero from "./blog-hero";
import blogIndex from "./blog-index";
import blogPostContent from "./blog-post-content";
import blogPostList from "./blog-post-list";
import blogRelated from "./blog-related";
import blogToc from "./blog-toc";
import blogTopicCards from "./blog-topic-cards";
import blogTrending from "./blog-trending";

/**
 * Blog-specific page-builder modules — dispatched by the blog's `ModuleRenderer`,
 * not by the generic `BLOCK_RENDERERS`. The 17 generic modules live in
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
  blogRelated,
  blogToc,
  blogTopicCards,
  blogTrending,
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
  "module.blog-topic-cards",
  "module.blog-trending",
] as const;

export type BlogModuleType = (typeof BLOG_MODULE_TYPES)[number];

/**
 * The blog blocks a site page (`page.sections[]`, the home page) can hold, to promote the
 * blog anywhere. Not the blog's own page chrome (`blog-index`, `blog-post-content`).
 */
export const BLOG_SECTION_TYPES = [
  "module.blog-featured",
  "module.blog-trending",
  "module.blog-post-list",
  "module.blog-collection",
  "module.blog-category-spotlight",
  "module.blog-topic-cards",
  "module.blog-hero",
  "module.blog-explore",
] as const;

/**
 * The blog blocks a sidebar card can hold. `blog-toc` and `blog-related` exist only here:
 * they describe the post being read. In a sidebar the post lists show as a compact list.
 */
export const BLOG_SIDEBAR_TYPES = [
  "module.blog-toc",
  "module.blog-related",
  "module.blog-trending",
  "module.blog-featured",
  "module.blog-post-list",
  "module.blog-collection",
] as const;
