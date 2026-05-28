import type { StructureBuilder, StructureResolver } from "sanity/structure";

/**
 * Sidebar du Studio — regroupe Blog (singleton + articles/auteurs/
 * catégories/tags), les documents référencés par les modules de
 * page-builder (Citations/Personnes/Logos/Formulaires), et masque tout
 * le reste de la liste racine.
 *
 * Les types de documents localisés (`post`, `category`, `tag`, `quote`)
 * exposent chacun une liste parente avec des enfants « English » /
 * « Français » pour que les éditeurs bilingues ne parcourent pas une
 * seule liste mélangée. Les templates de création par (type, locale)
 * sont définis dans `sanity.config.ts`.
 *
 * Les modules de page-builder (Encadré / Liste de cartes / etc.) sont
 * des types objet imbriqués dans `blog.frontpageModules` et
 * `blog.postModules` — ils n'apparaissent pas dans la sidebar.
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
              S.documentTypeListItem("author").title("Auteurs"),
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
              S.documentTypeListItem("person").title("Personnes"),
              S.documentTypeListItem("logo").title("Logos"),
              S.documentTypeListItem("form").title("Formulaires"),
            ]),
        ),
    ]);

/**
 * Entrée à deux niveaux dans la sidebar : un parent étiqueté p.ex.
 * « Articles » avec des enfants EN/FR, plus « Toutes les langues » pour
 * les utilisateurs avancés. Chaque feuille pré-remplit le template de
 * création avec la `language` correspondante.
 */
function languageSplit(
  S: StructureBuilder,
  type: "post" | "category" | "tag" | "quote",
  title: string,
) {
  return S.listItem()
    .title(title)
    .child(
      S.list()
        .title(title)
        .items([
          languageList(S, type, "en", "English"),
          languageList(S, type, "fr", "Français"),
          S.divider(),
          S.documentTypeListItem(type).title("Toutes les langues"),
        ]),
    );
}

function languageList(
  S: StructureBuilder,
  type: string,
  lang: "en" | "fr",
  label: string,
) {
  return S.listItem()
    .title(label)
    .child(
      S.documentTypeList(type)
        .title(`${label} — ${type}`)
        .filter("_type == $type && language == $lang")
        .params({ type, lang })
        .initialValueTemplates([
          S.initialValueTemplateItem(`${type}-${lang}`, { language: lang }),
        ]),
    );
}
