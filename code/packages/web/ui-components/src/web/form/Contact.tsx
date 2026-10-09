/**
 * Renders the module.contact block server-side under the app's contact feature flag.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/Contact.md
 */
import type { ContactModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { blockFeatures } from "../features";
import { ContactForm } from "./ContactForm";

/**
 * `module.contact` renderer — the server half. Owns the feature gate: with the
 * app-injected `contact` flag off (`configureBlocks`) the block renders nothing
 * (the `/api/contact` route 404s in lockstep). Otherwise hands the resolved copy
 * to the client `<ContactForm>` (needs `useState` for the submit flow).
 */
export function Contact(props: ContactModule) {
  // The code flag, then the Studio switch (`enabled`, projected by the page query).
  if (!blockFeatures().contact || props.enabled === false) return null;
  // `renderBlock` injects `components` + `inline` at runtime; strip them — a
  // client child can't receive the non-serializable render-function map.
  const { components, inline, enabled, ...rest } = props as ContactModule & {
    components?: unknown;
    inline?: boolean;
  };
  void components;
  void inline;
  void enabled;
  return <ContactForm {...rest} />;
}
