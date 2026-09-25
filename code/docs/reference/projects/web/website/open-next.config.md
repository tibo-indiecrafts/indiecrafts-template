---
title: "OpenNext config (website)"
description: "OpenNext Cloudflare deployment config for the website, with an R2-backed incremental cache."
status: stable
---

# OpenNext config (website)

> Deploys the website's Next.js build to Cloudflare Workers with an R2-backed incremental cache.

## Purpose

Configures OpenNext (Cloudflare) for the website so the Next.js app deploys to Cloudflare Workers. It wires an R2-backed incremental cache so ISR, `revalidate`, and cached fetches survive across the many stateless Worker isolates. The R2 bucket is bound as `NEXT_INC_CACHE_R2_BUCKET` per environment in `wrangler.toml`.

## Exports

- Default export: the Cloudflare OpenNext config (`defineCloudflareConfig({ incrementalCache: r2IncrementalCache })`).

## Source

`code/projects/web/surfaces/website/open-next.config.ts`
