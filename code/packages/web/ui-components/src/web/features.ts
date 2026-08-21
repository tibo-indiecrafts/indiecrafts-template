/**
 * Page-builder block feature gates, injected by the app. The `module.newsletter` /
 * `module.waitlist` / `module.contact` renderers self-hide when their feature is
 * off — but `features` is app-owned (`@/config`) and this package stays
 * app-agnostic, so the app injects the flags once via `configureBlocks()` (in its
 * `instrumentation.ts`).
 *
 * Defaults = the template's shipped set (all on), so a single app renders correctly
 * before configure runs; the app overrides at boot. Receives plain booleans — no app
 * import, matching how `renderBlock` receives its `components` map.
 *
 * ponytail: module-scoped, one server runtime (dev + Cloudflare Workers). Mirrors
 * the blog island's `@indiecrafts/modules-web-blog/lib/config`.
 */
export type BlockFeatures = {
  newsletter: boolean;
  waitlist: boolean;
  contact: boolean;
};

let ref: BlockFeatures = { newsletter: true, waitlist: true, contact: true };

/** Called once by the app at boot with its own `features.{newsletter,waitlist,contact}`. */
export function configureBlocks(flags: BlockFeatures): void {
  ref = flags;
}

/** The block feature gates for this app. */
export const blockFeatures = (): BlockFeatures => ref;
