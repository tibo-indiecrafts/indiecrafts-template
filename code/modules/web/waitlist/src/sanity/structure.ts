/**
 * Build the waitlist desk section — the settings singleton and the entries lists.
 *
 * @see docs/reference/modules/web/waitlist/src/sanity/structure.md
 */
import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { UsersIcon } from "@sanity/icons/Users";
import { apiVersion } from "@indiecrafts/packages-web-sanity/env";

/**
 * "Liste d'attente" desk — the settings singleton + the entries. The top
 * "Tous·tes" list is a `documentTypeList`, so it carries the native **+ Create**
 * button (an editor can add a row by hand); the status sub-lists are read views.
 */
function entriesItem(S: StructureBuilder) {
  const byStatus = (title: string, status: string) =>
    S.listItem()
      .title(title)
      .child(
        S.documentList()
          .title(title)
          .schemaType("waitlistEntry")
          .apiVersion(apiVersion)
          .filter('_type == "waitlistEntry" && status == $status')
          .params({ status })
          .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
      );
  return S.listItem()
    .title("Inscrit·e·s")
    .icon(UsersIcon)
    .child(
      S.list()
        .title("Inscrit·e·s")
        .items([
          S.listItem()
            .title("Tous·tes")
            .child(
              S.documentTypeList("waitlistEntry")
                .title("Tous·tes les inscrit·e·s")
                .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
            ),
          byStatus("En attente", "waiting"),
          byStatus("Invité·e·s", "invited"),
        ]),
    );
}

/**
 * The waitlist's desk section(s) — the settings singleton + the entries list.
 * Feature-gating is the app's job: `waitlistSanity(enabled)` returns `[]` here
 * when the app's `features.waitlist` is off.
 */
export function waitlistStructure(S: StructureBuilder): ListItemBuilder[] {
  return [
    S.listItem()
      .title("Liste d'attente (réglages)")
      .icon(UsersIcon)
      .child(
        S.editor()
          .id("waitlistSettings")
          .schemaType("waitlistSettings")
          .documentId("waitlistSettings"),
      ),
    entriesItem(S),
  ];
}
