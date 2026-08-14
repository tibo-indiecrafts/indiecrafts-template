/**
 * Next runs `register()` once at server startup (per runtime), before any route
 * is handled — the guaranteed point to inject this app's config into the islands
 * it mounts. The blog + page-builder-block renderers read app-injected feature
 * flags (they can't import an app); this is where the app hands them over.
 *
 * On a multi-runtime host (node + edge) `register` runs per runtime, so each gets
 * configured. This app targets one runtime (dev + Cloudflare Workers).
 */
export async function register(): Promise<void> {
  const { configureIslands } = await import("@/lib/islands");
  configureIslands();
}
