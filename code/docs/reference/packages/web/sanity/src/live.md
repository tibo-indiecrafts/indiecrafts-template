---
title: "Sanity live + preview"
description: "Live content subscription and draft-preview fetch wrapper for Sanity-backed pages."
status: stable
---

# Sanity live + preview

> Live revalidation and draft-mode fetching for Sanity content.

## Purpose

Wraps Sanity live content and draft preview. `<SanityLive />`, mounted in the layout, subscribes to Sanity's listen API and revalidates pages when content changes. `sanityFetchLive` switches the perspective to `drafts` when draft mode is enabled — call it from any Sanity-backed page or route handler instead of `client.fetch`. Build-time fetches (`generateStaticParams`, `app/sitemap.ts`) must stay on `client.fetch`, because `sanityFetchLive` calls the request-scoped `draftMode()`.

## Exports

- `SanityLive` — the React component that subscribes to live updates.
- `sanityFetch` — the `defineLive` fetch helper.
- `sanityFetchLive` — request-scoped fetch that picks the drafts or published perspective.

## Usage

```ts
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";

const posts = await sanityFetchLive<Post[]>({ query: POSTS_QUERY });
```

## Source

`code/packages/web/sanity/src/live.ts`
