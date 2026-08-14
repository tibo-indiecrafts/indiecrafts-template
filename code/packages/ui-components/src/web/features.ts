/**
 * Page-builder block feature gates, injected by the app. The `module.newsletter` /
 * `module.waitlist` renderers self-hide when their feature is off — but `features`
 * is app-owned (`@/config`) and this package stays app-agnostic, so the app injects
 * the two flags once via `configureBlocks()` (in its `instrumentation.ts`).
 *
 * Defaults = the template's shipped set (both on), so a single app renders correctly
 * before configure runs; the app overrides at boot. Receives plain booleans — no app
 * import, matching how `renderBlock` receives its `components` map.
 *
 * ponytail: module-scoped, one server runtime (dev + Cloudflare Workers). Mirrors
 * the blog island's `@indiecrafts/blog/lib/config`.
 */
export type BlockFeatures = { newsletter: boolean; waitlist: boolean };

let ref: BlockFeatures = { newsletter: true, waitlist: true };

/** Called once by the app at boot with its own `features.{newsletter,waitlist}`. */
export function configureBlocks(flags: BlockFeatures): void {
  ref = flags;
}

/** The block feature gates for this app. */
export const blockFeatures = (): BlockFeatures => ref;
