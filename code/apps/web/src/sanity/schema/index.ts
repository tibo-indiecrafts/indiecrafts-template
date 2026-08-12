import type { SchemaTypeDefinition } from "sanity";

// Core, feature-independent SEO documents + objects. These live outside
// `features/blog` because SEO/structured-data is site-wide — it must survive
// with the blog feature removed. Registered directly in `sanity.config.ts`.
import siteSettings from "./site-settings";
import siteMeta from "./site-meta";
import legalPage from "./legal-page";
import navigation from "./navigation";
import cookieConsent from "./cookie-consent";
import pageSeo from "./objects/page-seo";
import globalSchema from "./objects/global-schema";
import navItem from "./objects/nav-item";
import localeString from "./objects/locale-string";
import cookieCategory from "./objects/cookie-category";
import cookieEntry from "./objects/cookie-entry";

export const coreSchemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  siteMeta,
  legalPage,
  navigation,
  cookieConsent,
  pageSeo,
  globalSchema,
  navItem,
  localeString,
  cookieCategory,
  cookieEntry,
];
