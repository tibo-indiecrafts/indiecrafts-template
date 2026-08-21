import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { EnvelopeIcon, DownloadIcon } from "@sanity/icons";
import { apiVersion } from "@indiecrafts/packages-web-sanity/env";

/**
 * "Abonnés" desk — subscribers captured via `/api/newsletter`, grouped by
 * `status` (mirrors the blog Commentaires moderation desk).
 */
function subscriberStructureItem(S: StructureBuilder) {
  const byStatus = (title: string, status: string) =>
    S.listItem()
      .title(title)
      .child(
        S.documentList()
          .title(title)
          .schemaType("subscriber")
          .apiVersion(apiVersion)
          .filter('_type == "subscriber" && status == $status')
          .params({ status })
          .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
      );
  return S.listItem()
    .title("Abonnés")
    .icon(EnvelopeIcon)
    .child(
      S.list()
        .title("Abonnés")
        .items([
          byStatus("En attente", "pending"),
          byStatus("Confirmés", "confirmed"),
          byStatus("Désabonnés", "unsubscribed"),
        ]),
    );
}

/**
 * The newsletter's desk section(s) — the settings singleton + the Abonnés
 * moderation list. Feature-gating is the app's job: `newsletterSanity(enabled)`
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
    subscriberStructureItem(S),
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
