/**
 * Renders the module.waitlist block server-side under the waitlist feature flag.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/Waitlist.md
 */
import type { WaitlistModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { formBlock } from "./formBlock";
import { WaitlistForm } from "./WaitlistForm";

/**
 * `module.waitlist` renderer — the server half. Owns the feature gate: with the
 * app-injected `waitlist` flag off (`configureBlocks`) the block renders nothing
 * (the `/api/waitlist` route 404s in lockstep). Otherwise hands the resolved copy
 * to the client `<WaitlistForm>` (needs `useState` for the submit flow).
 * `formBlock` also hides it when the feature's Studio switch is off.
 */
export function Waitlist(props: WaitlistModule) {
  const form = formBlock("waitlist", props);
  return form ? <WaitlistForm {...form} /> : null;
}
