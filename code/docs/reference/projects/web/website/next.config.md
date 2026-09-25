---
title: "Website Next config"
description: "Next.js configuration for the website surface: transpiled bricks, Studio embed toggle, image loader, and hardened security headers."
status: stable
---

# Website Next config

> The website's Next.js build config — bricks, the `/studio` embed toggle, the CDN image loader, and security headers.

## Purpose

Configures the Next.js build for `@indiecrafts/web-surfaces-website`. It wraps the base config with the `next-intl` plugin and the bundle analyzer, transpiles the workspace bricks consumed as source, and drives the deterministic Sanity Studio embed/exclusion by `pageExtensions`.

## Exports

- `default` — the composed `NextConfig`, wrapped by `withBundleAnalyzer(withNextIntl(...))`.

Key behaviors set in the config:

- `EMBED_STUDIO` (from `NEXT_PUBLIC_EMBED_STUDIO`) adds `studio.ts`/`studio.tsx` to `pageExtensions` for local dev, and drops them for the Cloudflare build so the `sanity` package never enters the Worker bundle.
- `transpilePackages` — the `@indiecrafts/*` workspace bricks compiled from source.
- `assetPrefix` — first-party asset CDN prefix from `site.cdnUrl`.
- `images.loaderFile` — routes every `next/image` src through the Sanity CDN loader.
- `reactCompiler` — enabled in production only.
- `redirects()` — sends `/studio` to the hosted Studio when it is not embedded.
- `headers()` — emits `securityHeaders(...)` with `cspMode: "proxy"`, plus `studioCspRule` and `permissiveCspRule("/maintenance", ...)`.
- `initOpenNextCloudflareForDev()` — wires `wrangler dev` bindings during `next dev`.

## Source

`code/projects/web/surfaces/website/next.config.ts`
