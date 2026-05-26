/**
 * Augment the `cobe` types — the upstream shadcn/Magic UI `globe.tsx` reads
 * `state` via an `onRender` callback that newer `cobe` versions moved out of
 * `COBEOptions` into a hook-style API. Upstream UI code is read-only, so we
 * re-declare the option here rather than patching the component.
 *
 * Remove this file when Magic UI updates its globe.tsx to the new cobe API.
 */

import "cobe";

declare module "cobe" {
  interface COBEOptions {
    onRender?: (state: Record<string, unknown>) => void;
  }
}
