import type { SchemaTypeDefinition } from "sanity";
import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import announcementBar, {
  announcementItem,
  announcementLink,
} from "./announcement-bar";
import announcementToast from "./announcement-toast";
import {
  announcementStructureItem,
  announcementToastStructureItem,
} from "./structure";

/**
 * The announcement brick's Sanity contribution — the `announcementBar` +
 * `announcementToast` singletons + the shared item/link objects + their two desk
 * sections. Add to the `sharedModules` array in `sanity.config.ts` to activate
 * (site-wide chrome).
 */
export const announcementSanity: SanityModule = {
  name: "announcement",
  schemaTypes: [
    announcementBar,
    announcementToast,
    announcementItem,
    announcementLink,
  ] as SchemaTypeDefinition[],
  structure: (S) => [
    announcementStructureItem(S),
    announcementToastStructureItem(S),
  ],
};
