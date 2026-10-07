---
title: "Trending popularity signal"
description: "Returns the popular post ids for the Trending block (currently empty)."
status: stable
---

# Trending popularity signal

> The Trending block's popularity source — a stub today.

## Purpose

Reads and records post views for the `blog-trending` block, through the shared api's anonymous per-post counter (EU D1; no cookie, no identity). `getPopularPostIds` asks `GET /v1/views/top` for the most-viewed posts of the last 30 days in a locale, uncached (time-based revalidation needs an OpenNext queue the website doesn't run) with a 1.5 s timeout; on any failure, or without `API_URL` / `APP_API_TOKEN`, it returns `[]` and Trending shows the latest posts. `recordPostView` forwards one view (`POST /v1/views`) with the visitor's IP in `x-client-ip` for the api's rate limit; it is best-effort and logs failures (a `429` is expected, not logged). Server-only.

## Exports

- `getPopularPostIds(locale, count)` — the most-viewed post `_id`s, most viewed first; `[]` on failure.
- `recordPostView({ postId, locale, clientIp })` — counts one view.

## Usage

```ts
import { getPopularPostIds } from "@indiecrafts/modules-web-blog/lib/popularity";

const ids = await getPopularPostIds(locale, 6);
```

## Source

`code/modules/web/blog/src/lib/popularity.ts`
