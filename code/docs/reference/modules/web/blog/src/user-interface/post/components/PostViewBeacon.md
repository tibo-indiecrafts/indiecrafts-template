---
title: "Post view beacon"
description: "Client component that counts one anonymous view of the post on screen for the Trending block."
status: stable
---

# Post view beacon

> One anonymous view per post render in a browser.

## Purpose

Mounted on the post page. After hydration it sends `{ postId, locale }` to `/api/views` with `navigator.sendBeacon` (`fetch` with `keepalive` as the fallback). Running after hydration means link prefetches and crawlers that don't run JavaScript don't count. It stores nothing on the device and sends no identity: a reload counts again, and the route's per-IP rate limit bounds the inflation. A failed `fetch` is logged. It renders nothing.

## Exports

- `PostViewBeacon({ postId, locale })` — the beacon.

## Source

`code/modules/web/blog/src/user-interface/post/components/PostViewBeacon.tsx`
