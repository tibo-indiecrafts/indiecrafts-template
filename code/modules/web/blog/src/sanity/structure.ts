import type { StructureBuilder, ListItemBuilder } from "sanity/structure";
import { CommentIcon } from "@sanity/icons";
import { apiVersion } from "@indiecrafts/sanity/env";
import { locales, type Locale } from "@indiecrafts/config";

/**
 * The blog's own desk section(s) — Blog (singleton + articles/auteurs/
 * catégories/tags), Références (page-builder Citations/Personnes), and
 * Commentaires (moderation). Returned as a plain list of top-level items; the
 * app's `composeSanity` stitches these together with the app-core sections into
 * one "Contenu" list. This module no longer owns the whole resolver.
 *
 * Localized types (`post`, `author`, `category`, `tag`, `quote`, `person`) each
 * expose EN/FR children so bilingual editors don't browse one mixed list.
 * Page-builder modules are object types nested in `blog.postModules` — not here.
 */
export function blogStructure(S: StructureBuilder): ListItemBuilder[] {
  return [
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
                S.editor()
                  .id("blog-singleton")
                  .schemaType("blog")
                  .documentId("blog"),
              ),
            S.divider(),
            languageSplit(S, "post", "Articles"),
            languageSplit(S, "author", "Auteurs"),
            languageSplit(S, "category", "Catégories"),
            languageSplit(S, "tag", "Tags"),
            languageSplit(S, "series", "Séries"),
          ]),
      ),

    // Témoignages (`quote`) + Équipe (`person`) now live in the page-builder desk
    // (`@indiecrafts/page-builder`) — they're the generic entities its blocks reference.

    // ── Comments moderation ─────────────────────────────
    // Submitted via /api/comments as `approved: false`; tick "Approuvé" on a
    // comment to publish it. "En attente" = the moderation queue.
    S.listItem()
      .title("Commentaires")
      .icon(CommentIcon)
      .child(
        S.list()
          .title("Commentaires")
          .items([
            S.listItem()
              .title("En attente")
              .child(
                S.documentList()
                  .title("En attente")
                  // Spam leaves the queue — the email "Spam" action + the Studio
                  // "Spam" list below both set `spam: true`.
                  .schemaType("comment")
                  .filter(
                    '_type == "comment" && approved != true && spam != true',
                  )
                  .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
              ),
            S.listItem()
              .title("Approuvés")
              .child(
                S.documentList()
                  .title("Approuvés")
                  .schemaType("comment")
                  .filter('_type == "comment" && approved == true')
                  .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
              ),
            S.listItem()
              .title("Spam")
              .child(
                S.documentList()
                  .title("Spam")
                  .schemaType("comment")
                  .filter('_type == "comment" && spam == true')
                  .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
              ),
          ]),
      ),
  ];
}

/**
 * Entrée à deux niveaux dans la sidebar : un parent étiqueté p.ex.
 * « Articles » avec des enfants EN/FR, plus « Toutes les langues » pour
 * les utilisateurs avancés. Chaque feuille pré-remplit le template de
 * création avec la `language` correspondante.
 */
function languageSplit(
  S: StructureBuilder,
  type: "post" | "category" | "tag" | "series" | "author",
  title: string,
  icon?: Parameters<ListItemBuilder["icon"]>[0],
) {
  const item = S.listItem()
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
  return icon ? item.icon(icon) : item;
}

function languageList(
  S: StructureBuilder,
  type: string,
  lang: Locale,
  label: string,
) {
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  return S.listItem()
    .title(label)
    .child(
      S.documentTypeList(type)
        .title(`${label} — ${typeLabel}`)
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
