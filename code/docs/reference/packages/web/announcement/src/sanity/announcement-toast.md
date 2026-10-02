---
title: "Announcement toast schema"
description: "The Sanity singleton schema for the richer announcement card: title, body, optional image, link, per-surface targeting, and a date window."
status: stable
---

# Announcement toast schema

> The `announcementToast` singleton — a richer card announcement than the bar.

## Purpose

The Sanity schema for the announcement toast, a single language-independent singleton (`_id: announcementToast`) that drives a richer card announcement than the bar: a title and body, an optional image, and an optional link. It is targeted per surface and shown "live now" from the enable toggle and date window. It is the sole runtime source, resolved by `resolveToast` and read server-side on the web surfaces (and served to mobile by the API Worker). It reuses the same `announcementLink` object the bar registers.

## Exports

- default export — the `announcementToast` document type (enable toggle, surfaces, title, body, optional image and alt text, link, auto-dismiss seconds, and a date window).

## Usage

```ts
import announcementToast from "@indiecrafts/packages-web-announcement/sanity/announcement-toast";
// registered via the announcementSanity module barrel
```

## Source

`code/packages/web/announcement/src/sanity/announcement-toast.ts`
