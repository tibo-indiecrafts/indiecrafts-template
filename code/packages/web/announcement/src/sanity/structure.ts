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
