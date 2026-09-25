---
title: "Explore tags section"
description: "Frontpage tag explorer — up to 24 tag chips with a hash prefix, sorted by post count."
status: stable
---

# Explore tags section

> Hash-prefixed tag chips for the `/blog` frontpage.

## Purpose

Tag explorer for the `/blog` frontpage. Its chip styling mirrors the categories section so the two read as siblings; the `#` prefix is the only visual cue distinguishing tags. Tags are sorted by post count descending and capped at 24 chips, with a "view all" link to `/blog/tag` when there are more. Returns `null` when there are no tags.

## Exports

- `ExploreTags` — server component. Props: `tags` (`Tag[]`), `heading`, `subheading`, and `viewAllLabel`.

## Usage

```tsx
import { ExploreTags } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/ExploreTags";

<ExploreTags
  tags={tags}
  heading={t("tags.heading")}
  subheading={t("tags.subheading")}
  viewAllLabel={t("tags.viewAll")}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/blog/sections/ExploreTags.tsx`
