---
title: "Link object"
description: "Sanity object schema for a polymorphic link — internal reference or external URL."
status: stable
---

# Link object

> A link that points to internal content or an external URL.

## Purpose

Defines the `link` Sanity object used inside page-builder modules. It resolves to an internal `page` or `post` reference, or to an external URL. Renderers normalise the resolved `href` through `LINK_FRAGMENT` in `src/sanity/queries.ts` (a page becomes `/slug`, a post becomes `/blog/slug`). It also carries an optional label and a `newTab` flag.

## Exports

- `default` — the `link` object schema, referenced by type name from other modules.

## Usage

```ts
import { defineField } from "sanity";

defineField({ name: "link", title: "Lien", type: "link" });
```

## Source

`code/packages/web/page-builder/src/sanity/schema/objects/link.ts`
