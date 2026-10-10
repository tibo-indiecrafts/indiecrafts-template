---
title: "Sidebar resolver"
description: "Resolves the sidebar cards of a page from Site web → Barre latérale and the page's own choice."
status: stable
---

# Sidebar resolver

> Returns the sidebar cards one page renders.

## Purpose

Resolves the sidebar cards of a page. The cards come from the locale's `sidebarSettings` entry for the page type, or from the document's own `choice`. `resolveSidebar` (page-builder) applies the choice first. The settings fetch is cached per request with React `cache`. A fetch error logs and returns `null`, so the page renders without a sidebar. When `features.blog` is off, `siteBlocks` drops every `module.blog-*` block. A page or a sidebar can still list these blocks from before the blog was turned off.

## Exports

- `getSidebar(locale, page, choice?)` — async; returns the `AnyModule[]` cards for page type `page`.
- `siteBlocks(blocks)` — returns the blocks this site can render (drops blog blocks when the blog is off).

## Usage

```ts
import { getSidebar } from "@/lib/sidebar";

const cards = await getSidebar(locale, "page", page.sidebar);
```

## Source

`code/projects/web/surfaces/website/src/lib/sidebar.ts`
