import type { SchemaTypeDefinition } from "sanity";
import accordionList from "./accordion-list";
import blogIndex from "./blog-index";
import blogPostContent from "./blog-post-content";
import blogPostList from "./blog-post-list";
import callout from "./callout";
import cardList from "./card-list";
import customHtml from "./custom-html";
import featureGrid from "./feature-grid";
import gallery from "./gallery";
import hero from "./hero";
import pricing from "./pricing";
import newsletter from "./newsletter";
import waitlist from "./waitlist";
import personList from "./person-list";
import prose from "./prose";
import quoteList from "./quote-list";
import statList from "./stat-list";
import stepList from "./step-list";

/** All blog-page-builder modules, in catalog order (used by `blog.ts`). */
export const moduleSchemas: SchemaTypeDefinition[] = [
  // Marketing / page
  hero,
  featureGrid,
  pricing,
  // Content
  accordionList,
  callout,
  cardList,
  gallery,
  personList,
  prose,
  statList,
  stepList,
  quoteList,
  // Utility
  customHtml,
  newsletter,
  waitlist,
  // Blog
  blogIndex,
  blogPostContent,
  blogPostList,
];

/** Module `_type` literal — used by query fragments + runtime renderer switch. */
export const MODULE_TYPES = [
  "module.hero",
  "module.feature-grid",
  "module.pricing",
  "module.accordion-list",
  "module.callout",
  "module.card-list",
  "module.gallery",
  "module.person-list",
  "module.prose",
  "module.stat-list",
  "module.step-list",
  "module.quote-list",
  "module.custom-html",
  "module.newsletter",
  "module.waitlist",
  "module.blog-index",
  "module.blog-post-content",
  "module.blog-post-list",
] as const;

export type ModuleType = (typeof MODULE_TYPES)[number];
