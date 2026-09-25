/**
 * Assemble the email brick's Sanity module.
 *
 * @see docs/reference/packages/web/email/src/sanity/index.md
 */

import type { SanityModule } from "@indiecrafts/packages-web-sanity/module";
import { buildEmailStrings } from "./email-strings";
import { emailStructure } from "./structure";

export { confirmationGroup, ownerAlertGroup } from "./groups";
export { buildClerkEmails, clerkEmailsStructureItem } from "./clerk-emails";
export { securityAlertGroups } from "./security-alert-group";
export { sendTestEmailAction } from "./send-test-action";
export {
  emailPreferencesSchema,
  emailPreferencesStructureItem,
} from "./email-preferences";

/**
 * The email brick's Sanity contribution — the `emailStrings` singleton + its
 * "E-mails" desk entry. The singleton's fields are **composed** from every
 * module's `emailGroups`, so pass the same module list you give `composeSanity`:
 *
 *   composeSanity([...modules, emailSanity(modules)])
 *
 * The brick owns the document (name, desk, "Send test" action); the modules own
 * their groups. Remove a module → its email group disappears.
 */
export function emailSanity(
  modules: Pick<SanityModule, "emailGroups">[],
): SanityModule {
  const groups = modules.flatMap((m) => m.emailGroups ?? []);
  return {
    name: "email",
    schemaTypes: [buildEmailStrings(groups)],
    structure: emailStructure,
  };
}
