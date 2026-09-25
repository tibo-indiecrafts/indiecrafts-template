---
title: "Post media object"
description: "Reusable Sanity object holding a post's slug and cover image or video — used as hero, card, and social poster."
status: stable
---

# Post media object

> A post's slug plus its cover image or video.

## Purpose

Defines the `postMedia` object type — the content-side essentials of a post that are not SEO. It holds the canonical `slug`, a cover `image` (also the default Open Graph card), and optional featured video (`videoUrl` for YouTube/Vimeo/Dailymotion, `videoFile` for an uploaded mp4/webm, plus `videoAutoplay` and `videoControls` toggles). A video takes over the hero, with the image acting as its poster. SEO fields live on the shared `seoMeta` instead. The slug is excluded from translation copy so each locale gets its own URL.

## Exports

- `default` — the `postMedia` Sanity object schema definition.

## Usage

```ts
import postMedia from "@indiecrafts/modules-web-blog/sanity/schema/objects/post-media";
// Registered in sanity/schema/index.ts; used by the post document's `media` field.
```

## Source

`code/modules/web/blog/src/sanity/schema/objects/post-media.ts`
