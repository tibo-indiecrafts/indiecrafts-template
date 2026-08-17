import type { SchemaTypeDefinition } from "sanity";
import type { SanityModule } from "@indiecrafts/sanity/module";
import announcementBar, { announcementItem, announcementLink } from "./announcement-bar";
import { announcementStructureItem } from "./structure";

/**
 * The announcement brick's Sanity contribution — the `announcementBar` singleton +
 * its item/link objects + the "Bandeau d'annonce" desk section. Add to the
 * `sharedModules` array in `sanity.config.ts` to activate (site-wide chrome).
 */
export const announcementSanity: SanityModule = {
  name: "announcement",
  schemaTypes: [
    announcementBar,
    announcementItem,
    announcementLink,
  ] as SchemaTypeDefinition[],
  structure: (S) => [announcementStructureItem(S)],
};
