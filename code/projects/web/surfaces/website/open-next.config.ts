/**
 * OpenNext (Cloudflare) config — deploys the Next.js app to Cloudflare Workers
 * with an R2-backed incremental cache (so ISR / `revalidate` / cached fetches
 * survive across the many stateless Worker isolates).
 *
 * The R2 bucket is bound as `NEXT_INC_CACHE_R2_BUCKET` per environment in
 * `wrangler.toml`. Runbook: `code/docs/projects/web/website/setup/deployment.md`.
 */
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
