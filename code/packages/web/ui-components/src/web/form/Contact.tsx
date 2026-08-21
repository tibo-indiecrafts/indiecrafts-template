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
  if (!blockFeatures().contact) return null;
  // `renderBlock` injects `components` + `inline` at runtime; strip them — a
  // client child can't receive the non-serializable render-function map.
  const { components, inline, ...rest } = props as ContactModule & {
    components?: unknown;
    inline?: boolean;
  };
  void components;
  void inline;
  return <ContactForm {...rest} />;
}
