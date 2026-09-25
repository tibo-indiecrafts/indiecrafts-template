---
title: "Surface targeting field"
description: "A shared Sanity field that lets an editor target an announcement at specific surfaces, with options sourced from the shared surface list."
status: stable
---

# Surface targeting field

> One per-surface targeting field, reused by the bar and the toast, whose options can never drift from the resolver.

## Purpose

The per-surface targeting field, reused by both the bar and the toast schemas. The option values come from the shared `SURFACES` list, so the Studio choices can never drift from the resolver. An empty selection means every surface (the resolver treats an empty list as "all").

## Exports

- `surfacesField` — a Sanity array field of surface strings, its options built from the shared surface list.

## Usage

```ts
import { surfacesField } from "@indiecrafts/packages-web-announcement/sanity/surfaces";

fields: [
  surfacesField,
  // ...other fields
];
```

## Source

`code/packages/web/announcement/src/sanity/surfaces.ts`
