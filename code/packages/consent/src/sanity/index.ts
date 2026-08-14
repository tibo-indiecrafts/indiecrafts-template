import type { SchemaTypeDefinition } from "sanity";
import type { SanityModule } from "@indiecrafts/sanity/module";
import cookieCategory from "./cookie-category";
import cookieConsent from "./cookie-consent";
import cookieEntry from "./cookie-entry";
import legalConsent from "./legal-consent";
import { cookieStructureItem, legalConsentStructureItem } from "./structure";

/**
 * The consent brick's Sanity contribution — the `cookieConsent` singleton +
 * its category/entry objects + the `legalConsent` legal re-acceptance singleton
 * + their desk sections. Add to the `composeSanity([...])` array in
 * `sanity.config.ts` to activate.
 */
export const consentSanity: SanityModule = {
  name: "consent",
  schemaTypes: [
    cookieConsent,
    cookieCategory,
    cookieEntry,
    legalConsent,
  ] as SchemaTypeDefinition[],
  structure: (S) => [cookieStructureItem(S), legalConsentStructureItem(S)],
};
