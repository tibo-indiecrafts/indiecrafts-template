import type { SanityModule } from "@indiecrafts/sanity/module";
import { schemaTypes } from "./schema";
import { newsletterStructure } from "./structure";
import { emailGroups } from "./email";

/**
 * The newsletter module's Sanity contribution — the `newsletterSettings`
 * singleton + `subscriber` doc + the desk sections + its two `emailStrings`
 * groups. Add to the `composeSanity([...])` array in `sanity.config.ts` to
 * activate.
 */
export const newsletterSanity: SanityModule = {
  name: "newsletter",
  schemaTypes,
  structure: newsletterStructure,
  emailGroups,
};
