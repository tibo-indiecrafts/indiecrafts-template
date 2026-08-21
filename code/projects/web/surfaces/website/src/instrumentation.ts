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

  // Server-side crash sink: the OpenNext Worker's console is silent in production
  // (no request-log noise), so forward error/fatal to Workers Logs via a transport
  // (fires independent of the console gate). Non-prod skips it — its console already
  // shows errors. Client-side errors (browser `error.tsx`) stay client-side by design.
  const { getCurrentEnvironment } = await import("@indiecrafts/packages-shared-config");
  if (getCurrentEnvironment() === "production") {
    const { addTransport } = await import("@indiecrafts/packages-shared-logger");
    const { cloudflareTransport } =
      await import("@indiecrafts/packages-shared-logger/cloudflare");
    addTransport(cloudflareTransport());
  }
}
