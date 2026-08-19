import type { SchemaTypeDefinition } from "sanity";
import accordionList from "./accordion-list";
import callout from "./callout";
import cardList from "./card-list";
import customHtml from "./custom-html";
import featureGrid from "./feature-grid";
import gallery from "./gallery";
import hero from "./hero";
import leadMagnet from "./lead-magnet";
import newsletter from "./newsletter";
import personList from "./person-list";
import pricing from "./pricing";
import prose from "./prose";
import quoteList from "./quote-list";
import statList from "./stat-list";
import stepList from "./step-list";
import waitlist from "./waitlist";

/** All generic page-builder modules, in catalog order. Blog-specific modules
 *  (`blog-index`, `blog-post-*`) live in `@indiecrafts/blog`. */
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
  leadMagnet,
];

/** Generic module `_type` literals — used by page/query fragments + the home page. */
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
  "module.lead-magnet",
] as const;

export type ModuleType = (typeof MODULE_TYPES)[number];
