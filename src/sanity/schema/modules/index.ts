import type { SchemaTypeDefinition } from "sanity";
import accordionList from "./accordion-list";
import blogIndex from "./blog-index";
import blogPostContent from "./blog-post-content";
import blogPostList from "./blog-post-list";
import breadcrumbs from "./breadcrumbs";
import callout from "./callout";
import cardList from "./card-list";
import customHtml from "./custom-html";
import formModule from "./form-module";
import heroSplit from "./hero-split";
import logoList from "./logo-list";
import personList from "./person-list";
import prose from "./prose";
import quoteList from "./quote-list";
import searchModule from "./search-module";
import statList from "./stat-list";
import stepList from "./step-list";

/** All blog-page-builder modules, in catalog order (used by `blog.ts`). */
export const moduleSchemas: SchemaTypeDefinition[] = [
  // Content
  accordionList,
  callout,
  cardList,
  heroSplit,
  logoList,
  personList,
  prose,
  statList,
  stepList,
  quoteList,
  // Utility
  breadcrumbs,
  customHtml,
  formModule,
  searchModule,
  // Blog
  blogIndex,
  blogPostContent,
  blogPostList,
];

/** Module `_type` literal — used by query fragments + runtime renderer switch. */
export const MODULE_TYPES = [
  "module.accordion-list",
  "module.callout",
  "module.card-list",
  "module.hero-split",
  "module.logo-list",
  "module.person-list",
  "module.prose",
  "module.stat-list",
  "module.step-list",
  "module.quote-list",
  "module.breadcrumbs",
  "module.custom-html",
  "module.form",
  "module.search",
  "module.blog-index",
  "module.blog-post-content",
  "module.blog-post-list",
] as const;

export type ModuleType = (typeof MODULE_TYPES)[number];
