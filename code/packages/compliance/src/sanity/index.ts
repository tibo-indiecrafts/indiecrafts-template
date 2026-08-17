import type { SchemaTypeDefinition } from "sanity";
import type { SanityModule } from "@indiecrafts/sanity/module";
import { locales } from "@indiecrafts/config";
import cookieCategory from "./cookie-category";
import cookieConsent from "./cookie-consent";
import cookieEntry from "./cookie-entry";
import legalConsent from "./legal-consent";
import legalPage from "./legal-page";
import {
  cookieStructureItem,
  legalConsentStructureItem,
  legalStructureItem,
} from "./structure";

/**
 * The compliance brick's Sanity contribution — the whole legal + consent surface:
 * the `cookieConsent` singleton + its category/entry objects, the `legalConsent`
 * re-acceptance singleton, and the `legalPage` documents (the 5 editable legal
 * pages) with their per-language desk section + i18n templates. One barrel — add it
 * to `sharedModules` in the `composeStudio([...])` call in `sanity.config.ts`.
 */
export const complianceSanity: SanityModule = {
  name: "compliance",
  schemaTypes: [
    cookieConsent,
    cookieCategory,
    cookieEntry,
    legalConsent,
    legalPage,
  ] as SchemaTypeDefinition[],
  structure: (S) => [
    cookieStructureItem(S),
    legalConsentStructureItem(S),
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
