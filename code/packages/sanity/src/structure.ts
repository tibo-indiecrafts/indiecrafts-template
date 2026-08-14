import type { StructureBuilder, ListItemBuilder } from "sanity/structure";
import { locales } from "@indiecrafts/config";
import { apiVersion } from "./env";

/**
 * Core "SEO & métadonnées" desk section — feature-independent, so SEO stays
 * editable with the blog removed. Returned by `coreSanity.structure` and merged
 * into the Studio sidebar by `composeSanity` (see `@indiecrafts/sanity/module`).
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
 * Core "Accueil" desk item — the per-locale `homePage.<locale>` singletons
 * (the page-builder homepage: an ordered list of `module.*` blocks). One fixed
 * document per language, mirroring `siteMeta`. Feature-independent.
 */
export function homeStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Accueil")
    .child(
      S.list()
        .title("Accueil")
        .items(
          locales.map((l) =>
            S.listItem()
              .title(`Accueil — ${l.label}`)
              .child(
                S.editor()
                  .id(`homePage-${l.code}`)
                  .schemaType("homePage")
                  .documentId(`homePage.${l.code}`),
              ),
          ),
        ),
    );
}

/**
 * Core "Textes de l'interface" desk item — the per-locale `uiMessages.<locale>`
 * singletons (the app's chrome-string dictionary: nav, cookies, validation, blog
 * UI, system pages). One fixed document per language, mirroring `siteMeta`.
 */
export function uiMessagesStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Textes de l'interface")
    .child(
      S.list()
        .title("Textes de l'interface")
        .items(
          locales.map((l) =>
            S.listItem()
              .title(`Interface — ${l.label}`)
              .child(
                S.editor()
                  .id(`uiMessages-${l.code}`)
                  .schemaType("uiMessages")
                  .documentId(`uiMessages.${l.code}`),
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
