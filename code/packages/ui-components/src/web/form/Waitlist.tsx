import { features } from "@indiecrafts/config";
import type { WaitlistModule } from "@indiecrafts/ui-components/shared/types";
import { WaitlistForm } from "./WaitlistForm";

/**
 * `module.waitlist` renderer — the server half. Owns the feature gate: with
 * `features.waitlist` off the block renders nothing (the `/api/waitlist` route
 * 404s in lockstep). Otherwise hands the resolved copy to the client
 * `<WaitlistForm>` (needs `useState` for the submit flow).
 */
export function Waitlist(props: WaitlistModule) {
  if (!features.waitlist) return null;
  // `renderBlock` injects `components` + `inline` at runtime; strip them — a
  // client child can't receive the non-serializable render-function map.
  const { components, inline, ...rest } = props as WaitlistModule & {
    components?: unknown;
    inline?: boolean;
  };
  void components;
  void inline;
  return <WaitlistForm {...rest} />;
}
