/**
 * Renders the module.lead-magnet block server-side under the newsletter feature flag.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/LeadMagnet.md
 */
import type { LeadMagnetModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { blockFeatures } from "../features";
import { LeadMagnetForm } from "./LeadMagnetForm";

/**
 * `module.lead-magnet` renderer — the server half. Shares the `newsletter`
 * feature gate: with that app-injected flag off (`configureBlocks`) the block
 * renders nothing (the `/api/newsletter` route it posts to 404s in lockstep).
 * Otherwise hands the resolved copy to the client `<LeadMagnetForm>` (needs
 * `useState` for the submit flow).
 */
export function LeadMagnet(props: LeadMagnetModule) {
  if (!blockFeatures().newsletter) return null;
  // `renderBlock` injects `components` + `inline` at runtime; strip them — a
  // client child can't receive the non-serializable render-function map.
  const { components, inline, ...rest } = props as LeadMagnetModule & {
    components?: unknown;
    inline?: boolean;
  };
  void components;
  void inline;
  return <LeadMagnetForm {...rest} />;
}
