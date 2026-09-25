---
title: "Cookie entry schema"
description: "Sanity object schema for one row of the cookie declaration table."
status: stable
---

# Cookie entry schema

> One cookie the site or a third party sets, grouped by category.

## Purpose

The Sanity object schema for one row of the cookie declaration table shown on the cookie-policy page. Each entry describes a real cookie — its name, provider, category, purpose, retention, and first- or third-party origin — and is grouped by its category key on the rendered table.

## Exports

- `default` — the `cookieEntry` Sanity object type.

## Usage

```ts
import cookieEntry from "@indiecrafts/packages-web-compliance/sanity/cookie-entry";

export const schemaTypes = [cookieEntry];
```

## Source

`code/packages/web/compliance/src/sanity/cookie-entry.ts`
