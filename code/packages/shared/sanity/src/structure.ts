import type { StructureBuilder, ListItemBuilder } from "sanity/structure";
import { locales } from "@indiecrafts/config";

/**
 * Core "SEO & métadonnées" desk section — feature-independent, so SEO stays
 * editable with the blog removed. Returned by `coreSanity.structure` and merged
 * into the Studio sidebar by `composeStudio` (under "Contenu partagé" — see
 * `@indiecrafts/sanity/module` + `code/docs/shared/architecture/multi-app.md`).
 *
 * Two singletons:
 *   - `siteSettings` — one, language-independent (social, business type, schemas)
 *   - `siteMeta.<locale>` — one per language (site-wide defaults: tagline / description / OG / llms)
 */
// The home page is no longer a singleton — it's a `page` (`isHome`) owned by
// `@indiecrafts/page-builder` (desk "Accueil" in `pageBuilderStructure`). The old
// `homeStructureItem` was removed with the `homePage` schema.

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
      S.editor()
        .id("navigation")
        .schemaType("navigation")
        .documentId("navigation"),
    );
}

/**
 * Core "SEO & métadonnées" desk item — the language-independent `siteSettings`
 * singleton + the per-locale `siteMeta.<locale>` singletons. Feature-independent.
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
