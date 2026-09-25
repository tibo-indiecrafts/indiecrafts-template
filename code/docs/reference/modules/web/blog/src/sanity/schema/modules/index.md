---
title: "Blog module registry"
description: "Barrel of the ten blog-specific page-builder module schemas plus their type-name list and union type."
status: stable
---

# Blog module registry

> The list of blog-specific module schemas and their type names.

## Purpose

Collects the ten blog-specific page-builder module schemas (category-spotlight, collection, explore, featured, hero, index, post-content, post-list, topic-cards, trending) into `blogModuleSchemas`, and exposes their type names as `BLOG_MODULE_TYPES` plus a `BlogModuleType` union. These are dispatched by the blog's `ModuleRenderer`, not the generic `BLOCK_RENDERERS`.

## Exports

- `blogModuleSchemas` — a `SchemaTypeDefinition[]` of the ten blog module schemas.
- `BLOG_MODULE_TYPES` — a readonly tuple of the module type-name strings.
- `BlogModuleType` — a union type of the module type names.

## Usage

```ts
import {
  blogModuleSchemas,
  BLOG_MODULE_TYPES,
} from "@indiecrafts/modules-web-blog/sanity/schema/modules";
// blogModuleSchemas is spread into the schema registry; BLOG_MODULE_TYPES feeds the layout `of` lists.
```

## Source

`code/modules/web/blog/src/sanity/schema/modules/index.ts`
