import type { StructureResolver } from "sanity/structure";

/**
 * Studio sidebar — groups blog documents under one section with a
 * divider, instead of the default flat list of all document types.
 *
 * Adapted from sanitypress-with-typegen's structure.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("post").title("Posts"),
              S.documentTypeListItem("author").title("Authors"),
              S.documentTypeListItem("category").title("Categories"),
            ]),
        ),
    ]);
