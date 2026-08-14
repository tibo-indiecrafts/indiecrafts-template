import type { SanityModule } from "@indiecrafts/sanity/module";
import { schemaTypes } from "./schema";
import { waitlistStructure } from "./structure";
import { emailGroups } from "./email";

/**
 * The waitlist module's Sanity contribution — the `waitlistSettings` singleton +
 * `waitlistEntry` doc + the desk + its two `emailStrings` groups. Add to the
 * `composeSanity([...])` array in `sanity.config.ts` to activate.
 */
export const waitlistSanity: SanityModule = {
  name: "waitlist",
  schemaTypes,
  structure: waitlistStructure,
  emailGroups,
};
