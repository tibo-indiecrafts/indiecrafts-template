import type { SanityModule } from "@indiecrafts/sanity/module";
import { locales } from "@indiecrafts/config";
import {
  seoStructureItem,
  navStructureItem,
  legalStructureItem,
  homeStructureItem,
  uiMessagesStructureItem,
} from "@indiecrafts/sanity/structure";
import { coreSchemaTypes } from "./schema";

/**
 * The app's feature-independent Sanity contribution — the site-wide SEO,
 * navigation, cookie, and legal surfaces that survive with every module
 * removed. Composed alongside `sharedSanity` + each module's contribution in
 * `sanity.config.ts`. (The newsletter's subscriber doc + desk live in the
 * `@indiecrafts/newsletter` module.)
 */
export const coreSanity: SanityModule = {
  name: "core",
  schemaTypes: coreSchemaTypes,
  structure: (S) => [
    homeStructureItem(S),
    uiMessagesStructureItem(S),
    seoStructureItem(S),
    navStructureItem(S),
    legalStructureItem(S),
  ],
  i18nSchemaTypes: ["legalPage"],
  templates: locales.map(({ code: lang }) => ({
    id: `legalPage-${lang}`,
    title: `Page légale (${lang.toUpperCase()})`,
    schemaType: "legalPage",
    value: { language: lang },
  })),
};
