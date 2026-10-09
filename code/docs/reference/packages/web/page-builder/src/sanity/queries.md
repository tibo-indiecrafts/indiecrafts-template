---
title: "Page-builder GROQ fragments"
description: "Shared GROQ fragments for links, CTAs, and the generic page-builder modules."
status: stable
---

# Page-builder GROQ fragments

> The GROQ fragments that expand links, CTAs, and every generic module.

## Purpose

Holds the GROQ fragments for the generic page-builder modules, shared by the app's `page` and `homePage` queries and composed by the blog, which appends its own `blog-post-list` projection. The `defineQuery` call in the consuming file flags the final query for Sanity typegen. `LINK_FRAGMENT` resolves the internal or external link union into a single `href`; `MODULES_FRAGMENT` expands referenced fields per module type. The form blocks (`contact`, `waitlist`, `newsletter`, `lead-magnet`) also get `enabled`: their feature's Studio switch, so turning a form off hides every block of it. A missing settings document reads as on.

## Exports

- `LINK_FRAGMENT` — resolves the link union into an `href` (page, post, or external) plus the label.
- `CTA_FRAGMENT` — a CTA with its nested link expanded via `LINK_FRAGMENT`.
- `MODULES_FRAGMENT` — expands referenced fields for every generic `module.*` type, and adds `enabled` to the form blocks.

## Usage

```ts
import { MODULES_FRAGMENT } from "@indiecrafts/packages-web-page-builder/sanity/queries";

const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  modules[]{ ${MODULES_FRAGMENT} }
}`);
```

## Source

`code/packages/web/page-builder/src/sanity/queries.ts`
