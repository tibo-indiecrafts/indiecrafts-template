import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { apiVersion } from "@/sanity/env";
import { locales, type Locale } from "@/config";
import { seoStructureItem } from "@/sanity/structure";

/**
 * Sidebar du Studio — regroupe Blog (singleton + articles/auteurs/
 * catégories/tags), les documents référencés par les modules de
 * page-builder (Citations/Personnes), et masque tout
 * le reste de la liste racine.
 *
 * Tous les types de documents de contenu (`post`, `author`, `category`,
 * `tag`, `quote`, `person`) sont localisés — chacun expose une liste parente
 * avec des enfants « English » / « Français » pour que les éditeurs bilingues
 * ne parcourent pas une seule liste mélangée. Les templates de création par
 * (type, locale) sont définis dans `sanity.config.ts`.
 *
 * Les modules de page-builder (Encadré / Liste de cartes / etc.) sont
 * des types objet imbriqués dans `blog.postModules` — ils
 * n'apparaissent pas dans la sidebar.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu")
    .items([
      // ── Blog ──────────────────────────────────────────────
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              S.listItem()
                .title("Mise en page (singleton)")
                .child(
                  S.editor().id("blog-singleton").schemaType("blog").documentId("blog"),
                ),
              S.divider(),
              languageSplit(S, "post", "Articles"),
              languageSplit(S, "author", "Auteurs"),
              languageSplit(S, "category", "Catégories"),
              languageSplit(S, "tag", "Tags"),
            ]),
        ),

      S.divider(),

      // ── References for the page-builder modules ─────────
      S.listItem()
        .title("Références")
        .child(
          S.list()
            .title("Références")
            .items([
              languageSplit(S, "quote", "Citations"),
              languageSplit(S, "person", "Personnes"),
            ]),
        ),

      S.divider(),

      // ── Site-wide SEO & structured data (core, feature-independent) ──
      seoStructureItem(S),
    ]);

/**
 * Entrée à deux niveaux dans la sidebar : un parent étiqueté p.ex.
 * « Articles » avec des enfants EN/FR, plus « Toutes les langues » pour
 * les utilisateurs avancés. Chaque feuille pré-remplit le template de
 * création avec la `language` correspondante.
 */
function languageSplit(
  S: StructureBuilder,
  type: "post" | "category" | "tag" | "quote" | "author" | "person",
  title: string,
) {
  return S.listItem()
    .title(title)
    .child(
      S.list()
        .title(title)
        .items([
          ...locales.map((l) => languageList(S, type, l.code, l.label)),
          S.divider(),
          S.documentTypeListItem(type).title("Toutes les langues"),
        ]),
    );
}

function languageList(S: StructureBuilder, type: string, lang: Locale, label: string) {
  return S.listItem()
    .title(label)
    .child(
      S.documentTypeList(type)
        .title(`${label} — ${type}`)
        // Custom filters on a documentTypeList must declare the GROQ
        // apiVersion they're written against — Sanity warns now, will
        // hard-require in a future Studio release.
        // https://www.sanity.io/docs/help/structure-api-version-required-for-custom-filter
        .apiVersion(apiVersion)
        .filter("_type == $type && language == $lang")
        .params({ type, lang })
        .initialValueTemplates([
          S.initialValueTemplateItem(`${type}-${lang}`, { language: lang }),
        ]),
    );
}
