---
title: "Blog island config"
description: "Holds the app-injected blog feature flags and /blog page entry."
status: stable
---

# Blog island config

> The blog's compiled feature flags plus its `/blog` page entry.

## Purpose

The module cannot import an app, so the app injects its `@/config` values once at boot via `configureBlog()`. The route-gate, settings, and llms helpers read these instead of a central registry, so a second app can mount the same blog island with a different feature set. The defaults match the template's shipped set, so a single app is correct even before `configureBlog` runs. The config lives on `globalThis`: Next bundles `instrumentation.ts` apart from the routes, so a module variable set at boot never reached them.

## Exports

- `configureBlog(cfg)` — called once at boot with `{ flags, blogPage }`.
- `blogFlags()` — the compiled `BlogFlags` for this app.
- `blogPage()` — the `/blog` `PageConfig` (id / slug / enabled).
- `BlogFlags` — the flag shape (`blog`, `rss`, `comments`, `search`, `series`, `taxonomy`).

## Usage

```ts
import { configureBlog } from "@indiecrafts/modules-web-blog/lib/config";

configureBlog({ flags, blogPage });
```

## Source

`code/modules/web/blog/src/lib/config.ts`
