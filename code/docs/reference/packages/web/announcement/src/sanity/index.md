---
title: "Announcement Sanity module"
description: "The announcement brick's Sanity contribution: its schema types and desk sections, bundled as one SanityModule."
status: stable
---

# Announcement Sanity module

> The brick's Sanity barrel — schema types plus desk sections, added to `sharedModules` to activate.

## Purpose

The announcement brick's Sanity contribution. It bundles the `announcementBar` and `announcementToast` singletons, the shared item and link objects, and their two desk sections into one `SanityModule`. Add it to the `sharedModules` array in `sanity.config.ts` to activate the site-wide chrome.

## Exports

- `announcementSanity` — a `SanityModule` with the announcement `schemaTypes` and its `structure` (the two desk sections).

## Usage

```ts
import { announcementSanity } from "@indiecrafts/packages-web-announcement/sanity";

const sharedModules = [announcementSanity /* , ... */];
```

## Source

`code/packages/web/announcement/src/sanity/index.ts`
