import type { SchemaTypeDefinition } from "sanity";

// Core, feature-independent SEO documents + objects. These live outside
// `features/blog` because SEO/structured-data is site-wide — it must survive
// with the blog feature removed. Registered directly in `sanity.config.ts`.
import siteSettings from "./site-settings";
import siteMeta from "./site-meta";
import uiMessages from "./ui-messages";
import navigation from "./navigation";
import globalSchema from "./objects/global-schema";
import navItem from "./objects/nav-item";
// `cookieConsent`/`cookieCategory`/`cookieEntry` + `legalPage` (the legal pages)
// moved to the `@indiecrafts/packages-web-compliance` brick. `localeString` + `seoMeta` moved to
// the shared `@indiecrafts/packages-web-schema` brick (registered via its `sharedSanity`
// contribution); referenced here by type name. Per-page SEO is no longer a central
// array — each doc carries its own `.seo` (`seoMeta`).

export const coreSchemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  siteMeta,
  uiMessages,
  navigation,
  globalSchema,
  navItem,
];
