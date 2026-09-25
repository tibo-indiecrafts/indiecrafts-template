---
title: "SEO defaults"
description: "Site-wide SEO mechanics — crawl defaults, OG type, twitter card — and the AI-training crawler blocklist."
status: stable
---

# SEO defaults

> Crawl mechanics only; SEO copy lives in Sanity.

## Purpose

Holds the site-wide SEO mechanics only (crawl defaults, OG type, twitter card) plus the AI-training crawler blocklist. All SEO copy — siteName, tagline, description, keywords, OG image, verification codes — lives in Sanity and is read at render time. Per-page overrides live under a page's `seo.*` in `./pages`.

## Exports

- `AI_TRAINING_USER_AGENTS` — the AI training / dataset crawlers to block in `robots.txt` when `features.blockAiTraining` is on. Search and AI-search crawlers are deliberately not listed.
- `seoDefaults` — the crawl defaults (`robots`), `openGraph.type`, and the `twitter` card type.

## Usage

```ts
import {
  seoDefaults,
  AI_TRAINING_USER_AGENTS,
} from "@indiecrafts/packages-shared-config/web";

const robotsDefaults = seoDefaults.robots;
```

## Source

`code/packages/shared/config/src/web/seo.ts`
