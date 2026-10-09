/**
 * Renders the module.lead-magnet block server-side under the newsletter feature flag.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/LeadMagnet.md
 */
import type { LeadMagnetModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { formBlock } from "./formBlock";
import { LeadMagnetForm } from "./LeadMagnetForm";

/**
 * `module.lead-magnet` renderer — the server half. Shares the `newsletter`
 * feature gate: with that app-injected flag off (`configureBlocks`) the block
 * renders nothing (the `/api/newsletter` route it posts to 404s in lockstep).
 * Otherwise hands the resolved copy to the client `<LeadMagnetForm>` (needs
 * `useState` for the submit flow).
 * `formBlock` also hides it when the feature's Studio switch is off.
 */
export function LeadMagnet(props: LeadMagnetModule) {
  const form = formBlock("newsletter", props);
  return form ? <LeadMagnetForm {...form} /> : null;
}
