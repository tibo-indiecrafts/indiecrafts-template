---
title: "Core schema types"
description: "The array of core, feature-independent Sanity SEO and navigation schema types registered in the Studio."
status: stable
---

# Core schema types

> The feature-agnostic schema types that survive with the blog removed.

## Purpose

Collects the core, feature-independent SEO documents and objects — site settings, site meta, UI messages, navigation, global schema, and nav item. These live outside `features/blog` because SEO and structured data are site-wide and must survive with the blog feature removed. Registered directly in `sanity.config.ts`.

## Exports

- `coreSchemaTypes` — the array of core schema type definitions.

## Usage

```ts
import { coreSchemaTypes } from "@/sanity/schema";

const schema = { types: [...coreSchemaTypes] };
```

## Source

`code/projects/web/surfaces/website/src/sanity/schema/index.ts`
