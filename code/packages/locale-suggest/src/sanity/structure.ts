import type { ListItemBuilder, StructureBuilder } from "sanity/structure";

/** "Suggestion de langue" desk — the editable copy singleton. */
export function localeSuggestStructureItem(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Suggestion de langue")
    .child(
      S.editor().id("localeSuggest").schemaType("localeSuggest").documentId("localeSuggest"),
    );
}
