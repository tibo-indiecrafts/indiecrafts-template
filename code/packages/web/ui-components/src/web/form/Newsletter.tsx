/**
 * Renders the module.newsletter block server-side under the newsletter feature flag.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/Newsletter.md
 */
import type { NewsletterModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { formBlock } from "./formBlock";
import { NewsletterForm } from "./NewsletterForm";

/**
 * `module.newsletter` renderer — the server half. Owns the feature gate: with
 * the app-injected `newsletter` flag off (`configureBlocks`) the block renders
 * nothing (the `/api/newsletter` route 404s in lockstep). Otherwise hands the
 * resolved copy to the client `<NewsletterForm>` (needs `useState` for submit).
 * `formBlock` also hides it when the feature's Studio switch is off.
 */
export function Newsletter(props: NewsletterModule) {
  const form = formBlock("newsletter", props);
  return form ? <NewsletterForm {...form} /> : null;
}
