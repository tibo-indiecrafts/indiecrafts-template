import type { SanityModule } from "@indiecrafts/sanity/module";
import { schemaTypes } from "./schema";
import { newsletterStructure } from "./structure";
import { emailGroups } from "./email";

/**
 * The newsletter module's Sanity contribution — the `newsletterSettings`
 * singleton + `subscriber` doc + the desk sections + its two `emailStrings`
 * groups. Called with the app's `features.newsletter` (like `emailSanity(...)`):
 * `enabled` false hides the desk section (schema + email groups still register).
 * Add `newsletterSanity(features.newsletter)` to the modules array in
 * `sanity.config.ts` to activate.
 */
export function newsletterSanity(enabled: boolean): SanityModule {
  return {
    name: "newsletter",
    schemaTypes,
    structure: (S) => (enabled ? newsletterStructure(S) : []),
    emailGroups,
  };
}
