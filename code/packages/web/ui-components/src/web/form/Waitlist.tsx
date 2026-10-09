/**
 * Renders the module.waitlist block server-side under the waitlist feature flag.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/Waitlist.md
 */
import type { WaitlistModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { blockFeatures } from "../features";
import { WaitlistForm } from "./WaitlistForm";

/**
 * `module.waitlist` renderer — the server half. Owns the feature gate: with the
 * app-injected `waitlist` flag off (`configureBlocks`) the block renders nothing
 * (the `/api/waitlist` route 404s in lockstep). Otherwise hands the resolved copy
 * to the client `<WaitlistForm>` (needs `useState` for the submit flow).
 */
export function Waitlist(props: WaitlistModule) {
  // The code flag, then the Studio switch (`enabled`, projected by the page query).
  if (!blockFeatures().waitlist || props.enabled === false) return null;
  // `renderBlock` injects `components` + `inline` at runtime; strip them — a
  // client child can't receive the non-serializable render-function map.
  const { components, inline, enabled, ...rest } = props as WaitlistModule & {
    components?: unknown;
    inline?: boolean;
  };
  void components;
  void inline;
  void enabled;
  return <WaitlistForm {...rest} />;
}
