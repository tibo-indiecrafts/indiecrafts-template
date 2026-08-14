import { features } from "@indiecrafts/config";
import type { NewsletterModule } from "@indiecrafts/ui-components/shared/types";
import { NewsletterForm } from "./NewsletterForm";

/**
 * `module.newsletter` renderer — the server half. Owns the feature gate: with
 * `features.newsletter` off the block renders nothing (the `/api/newsletter`
 * route 404s in lockstep). Otherwise hands the resolved copy to the client
 * `<NewsletterForm>` (needs `useState` for the submit flow).
 */
export function Newsletter(props: NewsletterModule) {
  if (!features.newsletter) return null;
  // `renderBlock` also injects `components` (the portable-text render-function
  // map) + `inline` at runtime for nested-content blocks. `NewsletterForm` is a
  // client component, so those must NOT cross the boundary — functions can't be
  // serialized to a client child. Strip them; the form needs neither.
  const { components, inline, ...rest } = props as NewsletterModule & {
    components?: unknown;
    inline?: boolean;
  };
  void components;
  void inline;
  return <NewsletterForm {...rest} />;
}
