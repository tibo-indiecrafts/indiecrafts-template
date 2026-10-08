/**
 * Builds the newsletter desk structure.
 *
 * @see docs/reference/modules/web/newsletter/src/sanity/structure.md
 */
import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { DownloadIcon } from "@sanity/icons/Download";
import { apiVersion } from "@indiecrafts/packages-web-sanity/env";

/**
 * The newsletter's desk section(s) — the settings singleton + the lead magnets.
 * Subscribers live in Resend (the only list), not here. Feature-gating is the app's job: `newsletterSanity(enabled)`
 * returns `[]` here when the app's `features.newsletter` is off.
 */
export function newsletterStructure(S: StructureBuilder): ListItemBuilder[] {
  return [
    S.listItem()
      .title("Infolettre (réglages)")
      .icon(EnvelopeIcon)
      .child(
        S.editor()
          .id("newsletterSettings")
          .schemaType("newsletterSettings")
          .documentId("newsletterSettings"),
      ),
    S.listItem()
      .title("Aimants à prospects")
      .icon(DownloadIcon)
      .child(
        S.documentList()
          .title("Aimants à prospects")
          .schemaType("leadMagnet")
          .apiVersion(apiVersion)
          .filter('_type == "leadMagnet"'),
      ),
  ];
}
