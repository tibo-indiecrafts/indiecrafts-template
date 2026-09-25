---
title: "robots.txt route"
description: "Serves robots.txt, indexable only in production with a configured origin."
status: stable
---

# robots.txt route

> A Route Handler for robots.txt that also advertises the sitemap and `llms.txt`.

## Purpose

This is robots.txt as a Route Handler (not the typed `robots.ts` metadata route) so it can emit an `llms.txt` pointer alongside the standard directives. Only the production environment with a configured origin is indexable; every other deployment serves `Disallow: /`. When indexable and `features.blockAiTraining` is on, the AI training crawlers in `AI_TRAINING_USER_AGENTS` each get their own `Disallow: /` group before the `User-agent: *` allow group, so search and AI-search bots still index.

## Exports

- `robotsTxt(opts)` — pure builder; returns the robots.txt body string for the given policy.
- `GET()` — Route Handler; returns the `text/plain` response for the current environment.

## Usage

```ts
import { robotsTxt } from "./route";

const body = robotsTxt({
  indexable: true,
  blockAiTraining: true,
  aiTrainingBots: ["GPTBot"],
  siteUrl: "https://example.com",
  sitemap: true,
  llmsIndex: true,
});
```

## Source

`code/projects/web/surfaces/website/src/app/robots.txt/route.ts`
