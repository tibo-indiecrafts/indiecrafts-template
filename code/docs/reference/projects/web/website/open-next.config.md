---
title: "OpenNext config (website)"
description: "OpenNext Cloudflare deployment config for the website, with an R2-backed incremental cache."
status: stable
---

# OpenNext config (website)

> Deploys the website's Next.js build to Cloudflare Workers with an R2-backed incremental cache.

## Purpose

Configures OpenNext (Cloudflare) for the website so the Next.js app deploys to Cloudflare Workers. It wires an R2-backed incremental cache so ISR, `revalidate`, and cached fetches survive across the many stateless Worker isolates. It also sets the Durable Object tag cache (`doShardedTagCache`), so `revalidateTag` works: `<SanityLive>` calls it when content changes, and the R2-cached Sanity reads refresh. Without it OpenNext uses a no-op tag cache and an edit stays hidden until the next deploy. The R2 bucket (`NEXT_INC_CACHE_R2_BUCKET`) and the tag cache (`NEXT_TAG_CACHE_DO_SHARDED`) are bound per environment in `wrangler.toml`; `open-next.config.test.ts` checks the two agree.

## Exports

- Default export: the Cloudflare OpenNext config (`defineCloudflareConfig({ incrementalCache: r2IncrementalCache, tagCache: doShardedTagCache(…) })`).

## Source

`code/projects/web/surfaces/website/open-next.config.ts`
