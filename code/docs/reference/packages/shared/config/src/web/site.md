---
title: "Site config"
description: "Site identity and per-deployment knobs: origin, namespace prefix, CDN, locale cookie name, and logging."
status: stable
---

# Site config

> The few site values that must stay in code, not Sanity.

## Purpose

Defines site identity and per-deployment knobs. Almost all brand and SEO copy lives in Sanity; the only values that must stay in code are the ones that resolve synchronously at build (the origin, the namespace) or that other bricks read as config data (logging).

## Exports

- `DEFAULT_SITE_PREFIX` — the template's default project namespace, rewritten by `pnpm project:rename <slug>`.
- `site` — the site object: `url` (production origin), `websiteUrl` (canonical marketing URL), `prefix` (per-deployment namespace), `cdnUrl` (first-party asset CDN base).
- `isSiteConfigured` — `true` once `site.url` points at a real origin.
- `localeCookieName` — next-intl's locale cookie name, namespaced by `site.prefix`.
- `logging` — the logging config: per-environment minimum console level and the redacted context keys.

## Usage

```ts
import {
  site,
  isSiteConfigured,
} from "@indiecrafts/packages-shared-config/web";

const origin = site.url;
```

## Source

`code/packages/shared/config/src/web/site.ts`
