---
title: "Sidebar page types"
description: "The page types whose sidebar Site web → Barre latérale configures."
status: stable
---

# Sidebar page types

> Lists the page types that have a configurable sidebar.

## Purpose

Lists the page types of this site. Each entry is one field of `sidebarSettings.byType`. `title` is the Studio label. The Studio config reads the list to build the schema. `getSidebar` reads it to build one query per page type. The types are `home`, `page`, `blogIndex`, `post`, and `blogListing` (categories, tags, series, authors, search).

## Exports

- `SIDEBAR_PAGES` — the `{ name, title }` list, `as const`.
- `SidebarPage` — the union of the `name` values.

## Usage

```ts
import { SIDEBAR_PAGES, type SidebarPage } from "@/sanity/sidebar-pages";

const page: SidebarPage = "post";
```

## Source

`code/projects/web/surfaces/website/src/sanity/sidebar-pages.ts`
