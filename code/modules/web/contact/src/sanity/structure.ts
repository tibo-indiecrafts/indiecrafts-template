import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { EnvelopeIcon } from "@sanity/icons";
import { apiVersion } from "@indiecrafts/packages-web-sanity/env";

/**
 * "Contact" desk — the settings singleton + the received messages. The top
 * "Tous" list is a `documentTypeList` (read-only inbox — messages arrive via the
 * API, never created by hand); the status sub-lists are filtered views.
 */
function messagesItem(S: StructureBuilder) {
  const byStatus = (title: string, status: string) =>
    S.listItem()
      .title(title)
      .child(
        S.documentList()
          .title(title)
          .schemaType("contactMessage")
          .apiVersion(apiVersion)
          .filter('_type == "contactMessage" && status == $status')
          .params({ status })
          .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
      );
  return S.listItem()
    .title("Messages")
    .icon(EnvelopeIcon)
    .child(
      S.list()
        .title("Messages")
        .items([
          S.listItem()
            .title("Tous")
            .child(
              S.documentTypeList("contactMessage")
                .title("Tous les messages")
                .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
            ),
          byStatus("Nouveaux", "new"),
          byStatus("Traités", "handled"),
        ]),
    );
}

/**
 * The contact module's desk section(s) — the settings singleton + the messages
 * inbox. Feature-gating is the app's job: `contactSanity(enabled)` returns `[]`
 * here when the app's `features.contact` is off.
 */
export function contactStructure(S: StructureBuilder): ListItemBuilder[] {
  return [
    S.listItem()
      .title("Contact (réglages)")
      .icon(EnvelopeIcon)
      .child(
        S.editor()
          .id("contactSettings")
          .schemaType("contactSettings")
          .documentId("contactSettings"),
      ),
    messagesItem(S),
  ];
}
