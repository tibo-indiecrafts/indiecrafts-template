import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import { schemaTypes } from "./schema";
import { waitlistStructure } from "./structure";
import { emailGroups } from "./email";

/**
 * The waitlist module's Sanity contribution — the `waitlistSettings` singleton +
 * `waitlistEntry` doc + the desk + its two `emailStrings` groups. Called with the
 * app's `features.waitlist` (like `emailSanity(...)`): `enabled` false hides the
 * desk section (schema + email groups still register). Add
 * `waitlistSanity(features.waitlist)` to the modules array in `sanity.config.ts`.
 */
export function waitlistSanity(enabled: boolean): SanityModule {
  return {
    name: "waitlist",
    schemaTypes,
    structure: (S) => (enabled ? waitlistStructure(S) : []),
    emailGroups,
  };
}
