/**
 * Forward this app's server errors to Cloudflare Workers Logs in production.
 *
 * @see docs/reference/projects/web/app/src/instrumentation.md
 */

/**
 * Next runs `register()` once at server startup, before any route is handled. The
 * OpenNext Worker's console is silent in production (no request-log noise), so a
 * `logger.error` would be lost: this forwards error/fatal to Workers Logs through a
 * transport (it fires independent of the console gate). Non-prod skips it — its console
 * already shows errors. Same hook as the website's `instrumentation.ts`.
 */
export async function register(): Promise<void> {
  const { getCurrentEnvironment } = await import("@indiecrafts/packages-shared-config");
  if (getCurrentEnvironment() !== "production") return;
  const { addTransport } = await import("@indiecrafts/packages-shared-logger");
  const { cloudflareTransport } =
    await import("@indiecrafts/packages-shared-logger/cloudflare");
  addTransport(cloudflareTransport());
}
