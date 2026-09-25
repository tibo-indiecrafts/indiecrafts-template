---
title: "CTA object"
description: "Sanity object schema for a styled call-to-action link with a variant."
status: stable
---

# CTA object

> A reusable call-to-action link with a visual variant.

## Purpose

Defines the `cta` Sanity object — a `link` plus a `variant` (`primary`, `secondary`, or `ghost`). It is reused across several page-builder modules, such as hero, callout, and card-list.

## Exports

- `default` — the `cta` object schema, referenced by type name from other modules.

## Usage

```ts
import { defineField } from "sanity";

defineField({ name: "cta", title: "Appel à l'action", type: "cta" });
```

## Source

`code/packages/web/page-builder/src/sanity/schema/objects/cta.ts`
