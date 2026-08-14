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
 * The app's feature-independent Sanity contribution — the site-wide **shared**
 * surfaces (SEO, navigation, UI messages, legal) that survive with every module
 * removed and are read by every app/lens. Registers all `coreSchemaTypes` (incl.
 * `homePage`, whose *desk item* lives in `homeSanity` so it groups under the app,
 * not under shared content). Goes in the **"Contenu partagé"** Studio group.
 */
export const coreSanity: SanityModule = {
  name: "core",
  schemaTypes: coreSchemaTypes,
  structure: (S) => [
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

/**
 * The web app's own content desk entry — the marketing `homePage` singleton.
 * Structure-only (the `homePage` schema is registered by `coreSanity`); goes in the
 * **"Site web"** Studio group so app content sits apart from shared site config.
 */
export const homeSanity: SanityModule = {
  name: "home",
  schemaTypes: [],
  structure: (S) => [homeStructureItem(S)],
};
