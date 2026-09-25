---
title: "Announcement desk sections"
description: "Builds the two Studio desk list items that open the announcement bar and toast singleton editors."
status: stable
---

# Announcement desk sections

> The Studio desk entries that open the bar and toast singleton editors.

## Purpose

Builds the two Sanity Studio desk list items for the announcement singletons, each opening a fixed-document editor for the `announcementBar` or `announcementToast` singleton.

## Exports

- `announcementStructureItem(S)` — the "Bandeau d'annonce" desk item for the announcement bar singleton.
- `announcementToastStructureItem(S)` — the "Toast d'annonce" desk item for the rich-toast singleton.

## Usage

```ts
import {
  announcementStructureItem,
  announcementToastStructureItem,
} from "@indiecrafts/packages-web-announcement/sanity/structure";

structure: (S) => [
  announcementStructureItem(S),
  announcementToastStructureItem(S),
];
```

## Source

`code/packages/web/announcement/src/sanity/structure.ts`
