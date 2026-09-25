---
title: "Blog schema registry"
description: "Barrel that collects every blog document, object, and module schema into one array for the Studio."
status: stable
---

# Blog schema registry

> The array of every blog schema type, ready for the Studio.

## Purpose

Collects the blog's document schemas (`blog`, `post`, `author`, `category`, `tag`, `series`, `comment`), the post-specific `postMedia` object, and the ten blog module schemas (spread from `./modules`) into a single `schemaTypes` array. The generic page-builder blocks and shared objects live in `@indiecrafts/packages-web-page-builder` and are registered separately.

## Exports

- `schemaTypes` — a `SchemaTypeDefinition[]` of all blog documents, objects, and modules.

## Usage

```ts
import { schemaTypes } from "@indiecrafts/modules-web-blog/sanity/schema";
// Composed into the Studio schema config.
```

## Source

`code/modules/web/blog/src/sanity/schema/index.ts`
