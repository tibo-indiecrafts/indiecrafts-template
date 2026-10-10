---
title: "Blog module registry"
description: "Barrel of the twelve blog-specific page-builder module schemas plus their type-name lists per place."
status: stable
---

# Blog module registry

> The list of blog-specific module schemas and their type names.

## Purpose

Collects the twelve blog-specific page-builder module schemas (category-spotlight, collection, explore, featured, hero, index, post-content, post-list, related, toc, topic-cards, trending) into `blogModuleSchemas`. Three lists name the blocks each place can hold. The blog's `ModuleRenderer` dispatches these blocks, not the generic `BLOCK_RENDERERS`.

## Exports

- `blogModuleSchemas` — a `SchemaTypeDefinition[]` of the twelve blog module schemas.
- `BLOG_MODULE_TYPES` — the ten blocks of the blog's own layouts (`postModules`, `frontpageModules`). Not `blog-toc` or `blog-related`.
- `BlogModuleType` — a union type of the `BLOG_MODULE_TYPES` names.
- `BLOG_SECTION_TYPES` — the blog blocks a site page or the home page can hold, to promote the blog. Not the blog's own chrome (`blog-index`, `blog-post-content`).
- `BLOG_SIDEBAR_TYPES` — the blog blocks a sidebar card can hold: `blog-toc`, `blog-related`, and the post lists (trending, featured, post-list, collection).

## Usage

```ts
import {
  blogModuleSchemas,
  BLOG_MODULE_TYPES,
} from "@indiecrafts/modules-web-blog/sanity/schema/modules";
// blogModuleSchemas is spread into the schema registry; BLOG_MODULE_TYPES feeds the blog layout `of` lists.
// BLOG_SECTION_TYPES and BLOG_SIDEBAR_TYPES go to pageBuilderSanity({ sectionTypes, sidebarTypes }).
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/index.ts`
