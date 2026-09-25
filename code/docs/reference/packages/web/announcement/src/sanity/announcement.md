---
title: "Announcement read adapters"
description: "Thin, cached server-side readers that fetch the announcement bar and toast from Sanity and run them through the shared resolver."
status: stable
---

# Announcement read adapters

> Cached server adapters over the shared resolver — the same transform the API Worker runs for mobile.

## Purpose

The Sanity-only announcement read path for the web surfaces (website, app). These are thin adapters over the shared resolver — the same transform the API Worker runs for the non-web clients. The `announcementBar` and `announcementToast` singletons are the sole runtime source (no config fallback). Each reader is wrapped in React `cache` and returns an empty banner or a null toast on any error.

## Exports

- `getAnnouncement(locale, surface)` — fetches and resolves the banner for a locale and surface; returns an empty banner on error.
- `getAnnouncementToast(locale, surface)` — fetches and resolves the toast for a locale and surface; returns `null` on error.

## Usage

```ts
import {
  getAnnouncement,
  getAnnouncementToast,
} from "@indiecrafts/packages-web-announcement/sanity/announcement";

const banner = await getAnnouncement(locale, "website");
const toast = await getAnnouncementToast(locale, "website");
```

## Source

`code/packages/web/announcement/src/sanity/announcement.ts`
