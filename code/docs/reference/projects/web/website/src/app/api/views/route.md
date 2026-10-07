---
title: "Post view beacon route"
description: "Same-origin POST that counts one anonymous view of a blog post for the Trending block."
status: stable
---

# Post view beacon route

> `POST /api/views` — one view, no identity.

## Purpose

`PostViewBeacon` posts `{ postId, locale }` here once per post render in a browser. The route checks it is same-origin and rate-limits per IP (`security.views`, `withGuard`). It accepts only a published Sanity id (no `drafts.` / `versions.`) and a site locale, then forwards the view to the shared api (`recordPostView` → `POST /v1/views`), which adds 1 to that post's counter for the day in the EU D1. Nothing identifies the visitor: no cookie, and the IP is used only for rate limits. A valid request always answers `204`. It 404s with the blog off.

## Exports

- `POST` — the route handler.

## Source

`code/projects/web/surfaces/website/src/app/api/views/route.ts`
