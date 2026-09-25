---
title: "Author schema"
description: "Sanity document schema for a blog author — name, slug, photo, bio, social links, and SEO, localized per language."
status: stable
---

# Author schema

> The Sanity document that describes a blog author.

## Purpose

Defines the `author` document type for the blog Studio. It holds the author's name, role, URL slug, photo, PortableText bio, a repeatable list of social links, and shared SEO metadata. The `language` field is managed by `@sanity/document-internationalization`, so each locale gets its own author document and slug.

## Exports

- `default` — the `author` Sanity document schema definition.

## Usage

```ts
import author from "@indiecrafts/modules-web-blog/sanity/schema/author";
// Registered in sanity/schema/index.ts and composed into the Studio schema array.
```

## Source

`code/modules/web/blog/src/sanity/schema/author.ts`
