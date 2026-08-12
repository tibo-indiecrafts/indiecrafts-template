import type { StructureBuilder, ListItemBuilder } from "sanity/structure";
import { locales } from "@indiecrafts/config";
import { apiVersion } from "./env";

/**
 * Core "SEO & métadonnées" desk section — feature-independent, so SEO stays
 * editable with the blog removed. Composed into the Studio sidebar by
 * `src/features/blog/sanity/structure.ts` (or usable standalone).
 *
 * Two singletons:
 *   - `siteSettings` — one, language-independent (social, business type, schemas)
 *   - `siteMeta.<locale>` — one per language (tagline / description / OG / llms / pageSeo)
 */
/**
 * Core "Pages légales" desk section — the client-editable legal pages
 * (`legalPage` docs), grouped by language. Feature-independent (not blog).
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
                    S.initialValueTemplateItem(`legalPage-${l.code}`, { language: l.code }),
                  ]),
              ),
          ),
        ),
    );
}

/**
 * Core "Navigation" desk item — the single language-independent `navigation`
 * singleton (header menu + footer columns). Feature-independent (not blog).
 */
export function navStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Navigation")
    .child(
      S.editor().id("navigation").schemaType("navigation").documentId("navigation"),
    );
}

/**
 * Core "Cookies & consentement" desk item — the single `cookieConsent` singleton
 * (banner copy + consent categories + cookie inventory). Feature-independent.
 */
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

export function seoStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("SEO & métadonnées")
    .child(
      S.list()
        .title("SEO & métadonnées")
        .items([
          S.listItem()
            .title("Paramètres du site")
            .child(
              S.editor()
                .id("siteSettings")
                .schemaType("siteSettings")
                .documentId("siteSettings"),
            ),
          S.divider(),
          ...locales.map((l) =>
            S.listItem()
              .title(`SEO — ${l.label}`)
              .child(
                S.editor()
                  .id(`siteMeta-${l.code}`)
                  .schemaType("siteMeta")
                  .documentId(`siteMeta.${l.code}`),
              ),
          ),
        ]),
    );
}
