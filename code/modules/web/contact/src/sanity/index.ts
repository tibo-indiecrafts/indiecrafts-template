/**
 * Assemble the contact module's Sanity contribution as a feature-gated SanityModule.
 *
 * @see docs/reference/modules/web/contact/src/sanity/index.md
 */
import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import { schemaTypes } from "./schema";
import { contactStructure } from "./structure";
import { emailGroups } from "./email";

/**
 * The contact module's Sanity contribution — the `contactSettings` singleton +
 * `contactMessage` doc + the desk + its two `emailStrings` groups. Called with the
 * app's `features.contact` (like `emailSanity(...)`): `enabled` false hides the
 * desk section (schema + email groups still register). Add
 * `contactSanity(features.contact)` to the modules array in `sanity.config.ts`.
 */
export function contactSanity(enabled: boolean): SanityModule {
  return {
    name: "contact",
    schemaTypes,
    structure: (S) => (enabled ? contactStructure(S) : []),
    emailGroups,
  };
}
