/**
 * Renders the module.contact block server-side under the app's contact feature flag.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/Contact.md
 */
import type { ContactModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { formBlock } from "./formBlock";
import { ContactForm } from "./ContactForm";

/**
 * `module.contact` renderer — the server half. Owns the feature gate: with the
 * app-injected `contact` flag off (`configureBlocks`) the block renders nothing
 * (the `/api/contact` route 404s in lockstep). Otherwise hands the resolved copy
 * to the client `<ContactForm>` (needs `useState` for the submit flow).
 * `formBlock` also hides it when the feature's Studio switch is off.
 */
export function Contact(props: ContactModule) {
  const form = formBlock("contact", props);
  return form ? <ContactForm {...form} /> : null;
}
