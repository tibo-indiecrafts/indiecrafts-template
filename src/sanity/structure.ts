import type { StructureResolver } from "sanity/structure";

/**
 * Studio sidebar — groups Blog (singleton + posts/authors/categories),
 * the page-builder reference docs (Quotes/People/Logos/Forms), and keeps
 * everything else hidden from the root list.
 *
 * The page-builder modules themselves (Accordion/Callout/etc.) are
 * object types embedded inside `blog.frontpageModules` and
 * `blog.postModules` — they don't appear in the sidebar.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // ── Blog ──────────────────────────────────────────────
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              // Singleton: layout config for /blog + /blog/[slug]
              S.listItem()
                .title("Layout (singleton)")
                .child(
                  S.editor().id("blog-singleton").schemaType("blog").documentId("blog"),
                ),
              S.divider(),
              S.documentTypeListItem("post").title("Posts"),
              S.documentTypeListItem("author").title("Authors"),
              S.documentTypeListItem("category").title("Categories"),
            ]),
        ),

      S.divider(),

      // ── References for the page-builder modules ─────────
      S.listItem()
        .title("References")
        .child(
          S.list()
            .title("References")
            .items([
              S.documentTypeListItem("quote").title("Quotes"),
              S.documentTypeListItem("person").title("People"),
              S.documentTypeListItem("logo").title("Logos"),
              S.documentTypeListItem("form").title("Forms"),
            ]),
        ),
    ]);
