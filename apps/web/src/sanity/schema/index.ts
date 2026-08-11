import type { SchemaTypeDefinition } from "sanity";

// Core, feature-independent SEO documents + objects. These live outside
// `features/blog` because SEO/structured-data is site-wide — it must survive
// with the blog feature removed. Registered directly in `sanity.config.ts`.
import siteSettings from "./site-settings";
import siteMeta from "./site-meta";
import pageSeo from "./objects/page-seo";
import globalSchema from "./objects/global-schema";

export const coreSchemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  siteMeta,
  pageSeo,
  globalSchema,
];
