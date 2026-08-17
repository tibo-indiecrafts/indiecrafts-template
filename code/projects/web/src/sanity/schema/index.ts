import type { SchemaTypeDefinition } from "sanity";

// Core, feature-independent SEO documents + objects. These live outside
// `features/blog` because SEO/structured-data is site-wide — it must survive
// with the blog feature removed. Registered directly in `sanity.config.ts`.
import siteSettings from "./site-settings";
import siteMeta from "./site-meta";
import uiMessages from "./ui-messages";
import navigation from "./navigation";
import pageSeo from "./objects/page-seo";
import globalSchema from "./objects/global-schema";
import navItem from "./objects/nav-item";
// `cookieConsent`/`cookieCategory`/`cookieEntry` + `legalPage` (the legal pages)
// moved to the `@indiecrafts/compliance` brick. `localeString` + `seoMeta` moved to
// the shared `@indiecrafts/schema` brick (registered via its `sharedSanity`
// contribution); referenced here by type name.

export const coreSchemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  siteMeta,
  uiMessages,
  navigation,
  pageSeo,
  globalSchema,
  navItem,
];
