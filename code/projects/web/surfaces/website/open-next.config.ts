/**
 * OpenNext (Cloudflare) config — deploys the Next.js app to Cloudflare Workers
 * with an R2-backed incremental cache (so ISR / `revalidate` / cached fetches
 * survive across the many stateless Worker isolates) and a Durable Object tag
 * cache (so `revalidateTag` works).
 *
 * The R2 bucket is bound as `NEXT_INC_CACHE_R2_BUCKET` and the tag cache as
 * `NEXT_TAG_CACHE_DO_SHARDED` per environment in `wrangler.toml`. Runbook:
 * `code/docs/projects/web/website/setup/deployment.md`.
 */
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doShardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  // `sanityFetchLive` caches each read with `revalidate: false` + Sanity sync tags, and
  // `<SanityLive>` calls `revalidateTag` when content changes. Without a tag cache OpenNext
  // falls back to a no-op one: the call does nothing and a published edit stays hidden
  // until the next deploy. No queue: nothing here uses time-based revalidation.
  tagCache: doShardedTagCache({ baseShardSize: 12 }),
});
