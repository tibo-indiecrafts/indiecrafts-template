/**
 * Builds the announcement bar and toast Studio desk sections.
 *
 * @see docs/reference/packages/web/announcement/src/sanity/structure.md
 */

import type { ListItemBuilder, StructureBuilder } from "sanity/structure";

/** "Bandeau d'annonce" desk — the editable announcement singleton. */
export function announcementStructureItem(
  S: StructureBuilder,
): ListItemBuilder {
  return S.listItem()
    .title("Bandeau d'annonce")
    .child(
      S.editor()
        .id("announcementBar")
        .schemaType("announcementBar")
        .documentId("announcementBar"),
    );
}

/** "Toast d'annonce" desk — the editable rich-toast singleton. */
export function announcementToastStructureItem(
  S: StructureBuilder,
): ListItemBuilder {
  return S.listItem()
    .title("Toast d'annonce")
    .child(
      S.editor()
        .id("announcementToast")
        .schemaType("announcementToast")
        .documentId("announcementToast"),
    );
}
