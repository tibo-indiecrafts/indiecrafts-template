import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { EnvelopeIcon } from "@sanity/icons";

/**
 * The "E-mails" desk section — the single `emailStrings` singleton (config + copy
 * for every transactional email). `composeSanity` stitches this in with the other
 * owners.
 */
export function emailStructure(S: StructureBuilder): ListItemBuilder[] {
  return [
    S.listItem()
      .title("E-mails")
      .icon(EnvelopeIcon)
      .child(S.editor().id("emailStrings").schemaType("emailStrings").documentId("emailStrings")),
  ];
}
