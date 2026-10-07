---
title: "Post views store"
description: "Read/write layer for post_views — the anonymous per-post, per-day view counter behind the blog's Trending block."
status: stable
---

# Post views store

> The D1 store behind `POST /v1/views` and `GET /v1/views/top`.

## Purpose

Pure read/write layer for `post_views` (the `main` D1 table). A page view adds 1 to one counter per post id, locale and UTC day. It holds no personal data: no IP, no user id, no cookie. The website server records views; the blog's Trending block reads the top ids. The validators reject draft and release ids (`drafts.*`, `versions.*`) and anything that is not a Sanity id or a locale code. The cron deletes rows older than 90 days.

## Exports

- `isValidPostId(value)` — `true` for a published Sanity id: letters, digits, `.`, `_`, `-`, at most 128 characters, not `drafts.*` or `versions.*`.
- `isValidLocale(value)` — `true` for `xx` or `xx-XX`.
- `utcDay(now, daysAgo?)` — the UTC day (`YYYY-MM-DD`) `daysAgo` days before `now`.
- `recordView(db, postId, locale, day)` — one upsert: inserts the counter at 1, or adds 1.
- `topPostIds(db, locale, sinceDay, limit)` — post ids for the locale, most views since `sinceDay` (inclusive) first; ties sort by id.

## Usage

```ts
import { recordView, topPostIds, utcDay } from "./views/post-views";

await recordView(db, postId, "fr", utcDay(new Date()));
const ids = await topPostIds(db, "fr", utcDay(new Date(), 29), 8);
```

## Source

`code/shared/api/src/views/post-views.ts`
