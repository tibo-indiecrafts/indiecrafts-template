import type { ListItemBuilder, StructureBuilder } from "sanity/structure";

/** "Cookies & consentement" desk — the editable consent singleton. */
export function cookieStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Cookies & consentement")
    .child(S.editor().id("cookieConsent").schemaType("cookieConsent").documentId("cookieConsent"));
}

/** "Mise à jour des documents légaux" desk — the legal re-acceptance singleton. */
export function legalConsentStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Mise à jour des documents légaux")
    .child(S.editor().id("legalConsent").schemaType("legalConsent").documentId("legalConsent"));
}
