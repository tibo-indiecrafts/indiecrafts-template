import type { SchemaTypeDefinition } from "sanity";

// Core, feature-independent SEO documents + objects. These live outside
// `features/blog` because SEO/structured-data is site-wide — it must survive
// with the blog feature removed. Registered directly in `sanity.config.ts`.
import siteSettings from "./site-settings";
import siteMeta from "./site-meta";
import homePage from "./home-page";
import uiMessages from "./ui-messages";
import legalPage from "./legal-page";
import navigation from "./navigation";
import pageSeo from "./objects/page-seo";
import globalSchema from "./objects/global-schema";
import navItem from "./objects/nav-item";
// `cookieConsent` + `cookieCategory`/`cookieEntry` moved to the `@indiecrafts/consent` brick.
// `localeString` + `seoMeta` moved to the shared `@indiecrafts/schema` brick
// (registered via its `sharedSanity` contribution); referenced here by type name.

export const coreSchemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  siteMeta,
  homePage,
  uiMessages,
  legalPage,
  navigation,
  pageSeo,
  globalSchema,
  navItem,
];
