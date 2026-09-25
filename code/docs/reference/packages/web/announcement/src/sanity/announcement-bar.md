---
title: "Announcement bar schema"
description: "The Sanity singleton schema that drives the announcement strip: an array of announcements with copy, discount codes, links, and date windows."
status: stable
---

# Announcement bar schema

> The `announcementBar` singleton — the sole runtime source for the strip under the nav.

## Purpose

The Sanity schema for the announcement bar, a single language-independent singleton (`_id: announcementBar`) that drives the strip under the site navigation. It holds an array of announcements, each with per-locale text, an optional copyable discount code, and an optional link. It is the sole runtime source (no config fallback), read by `getAnnouncement`, which computes "live now" from the enable toggle and date windows and localizes the copy.

## Exports

- `announcementLink` — the link object type: an internal path or an external URL.
- `announcementItem` — one announcement: text, optional discount code, optional link, and a date window.
- default export — the `announcementBar` document type (enable toggle, dismissible flag, variant, surfaces, date window, and the `items` array).

## Usage

```ts
import announcementBar, {
  announcementItem,
  announcementLink,
} from "@indiecrafts/packages-web-announcement/sanity/announcement-bar";
// registered via the announcementSanity module barrel
```

## Source

`code/packages/web/announcement/src/sanity/announcement-bar.ts`
