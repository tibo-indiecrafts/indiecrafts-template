/**
 * Build the compliance desk sections for the Studio.
 *
 * @see docs/reference/packages/web/compliance/src/sanity/structure.md
 */

import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { locales } from "@indiecrafts/packages-shared-config";
import { apiVersion } from "@indiecrafts/packages-web-sanity/env";

/** "Cookies & consentement" desk — the editable consent singleton. */
export function cookieStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Cookies & consentement")
    .child(
      S.editor()
        .id("cookieConsent")
        .schemaType("cookieConsent")
        .documentId("cookieConsent"),
    );
}

/** "Mise à jour des documents légaux" desk — the legal re-acceptance singleton. */
export function legalConsentStructureItem(
  S: StructureBuilder,
): ListItemBuilder {
  return S.listItem()
    .title("Mise à jour des documents légaux")
    .child(
      S.editor()
        .id("legalConsent")
        .schemaType("legalConsent")
        .documentId("legalConsent"),
    );
}

/** "Demandes RGPD" desk — the data-subject requests, newest first. */
export function dataRequestStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Demandes RGPD")
    .child(
      S.documentTypeList("dataRequest")
        .title("Demandes RGPD")
        .apiVersion(apiVersion)
        .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
    );
}

/**
 * "Pages légales" desk section — the client-editable legal pages (`legalPage`
 * docs: mentions légales, confidentialité, cookies, CGU, CGV), grouped by language.
 */
export function legalStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Pages légales")
    .child(
      S.list()
        .title("Pages légales")
        .items(
          locales.map((l) =>
            S.listItem()
              .title(l.label)
              .child(
                S.documentTypeList("legalPage")
                  .title(`Pages légales — ${l.label}`)
                  .apiVersion(apiVersion)
                  .filter('_type == "legalPage" && language == $lang')
                  .params({ lang: l.code })
                  .initialValueTemplates([
                    S.initialValueTemplateItem(`legalPage-${l.code}`, {
                      language: l.code,
                    }),
                  ]),
              ),
          ),
        ),
    );
}
