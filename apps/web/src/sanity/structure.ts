import type { StructureBuilder, ListItemBuilder } from "sanity/structure";
import { locales } from "@/config";

/**
 * Core "SEO & métadonnées" desk section — feature-independent, so SEO stays
 * editable with the blog removed. Composed into the Studio sidebar by
 * `src/features/blog/sanity/structure.ts` (or usable standalone).
 *
 * Two singletons:
 *   - `siteSettings` — one, language-independent (social, business type, schemas)
 *   - `siteMeta.<locale>` — one per language (tagline / description / OG / llms / pageSeo)
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
