/**
 * Renders the module.newsletter block server-side under the newsletter feature flag.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/Newsletter.md
 */
import type { NewsletterModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { blockFeatures } from "../features";
import { NewsletterForm } from "./NewsletterForm";

/**
 * `module.newsletter` renderer — the server half. Owns the feature gate: with
 * the app-injected `newsletter` flag off (`configureBlocks`) the block renders
 * nothing (the `/api/newsletter` route 404s in lockstep). Otherwise hands the
 * resolved copy to the client `<NewsletterForm>` (needs `useState` for submit).
 */
export function Newsletter(props: NewsletterModule) {
  // The code flag, then the Studio switch (`enabled`, projected by the page query).
  if (!blockFeatures().newsletter || props.enabled === false) return null;
  // `renderBlock` also injects `components` (the portable-text render-function
  // map) + `inline` at runtime for nested-content blocks. `NewsletterForm` is a
  // client component, so those must NOT cross the boundary — functions can't be
  // serialized to a client child. Strip them; the form needs neither.
  const { components, inline, enabled, ...rest } = props as NewsletterModule & {
    components?: unknown;
    inline?: boolean;
  };
  void components;
  void inline;
  void enabled;
  return <NewsletterForm {...rest} />;
}
