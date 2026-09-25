---
title: "Web config entry"
description: "The web-only config primitives barrel: site origin, env / CSP, SEO, rate limits, and the page contract."
status: stable
---

# Web config entry

> The `./web` web-only config primitives.

## Purpose

The `/web` barrel of `@indiecrafts/packages-shared-config`. It is Next-flavored: site origin and prefix read `NEXT_PUBLIC_*` env, `env` builds the CSP, `pages` uses the `next` `Robots` type, and `seo` is crawl mechanics. Import these only from the web surfaces; portable primitives live in `../shared`.

## Exports

- Values and functions: `DEFAULT_SITE_PREFIX`, `site`, `isSiteConfigured`, `localeCookieName`, `logging`, `seoDefaults`, `AI_TRAINING_USER_AGENTS`, `isPageVisible`, `getCurrentEnvironment`, `getCSPConnectSources`, `getClerkCspHosts`, `rateLimits`, `RATE_WINDOW_SEC`, `defineFeatures`.
- Types: `PageConfig`, `PageSeo`, `RouteSlug`, `CanonicalOverride`, `OgImageUrl`, `ClerkCspHosts`, `RateLimitTier`, `FeatureValue`, `FeatureMap`.

## Usage

```ts
import {
  site,
  isPageVisible,
  rateLimits,
} from "@indiecrafts/packages-shared-config/web";
```

## Source

`code/packages/shared/config/src/web/index.ts`
