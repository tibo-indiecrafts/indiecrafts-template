---
title: "Modules barrel"
description: "Collects the generic page-builder module schemas and their type literals."
status: stable
---

# Modules barrel

> The catalog of generic page-builder modules, plus their `_type` literals.

## Purpose

Aggregates the generic `module.*` schemas into `moduleSchemas`, in catalog order, and exposes their `_type` strings as `MODULE_TYPES`. Blog-specific modules live in `@indiecrafts/modules-web-blog`, not here.

## Exports

- `moduleSchemas` — a `SchemaTypeDefinition[]` of the generic module schemas, in catalog order.
- `MODULE_TYPES` — a readonly tuple of the generic module `_type` literals (for example `module.hero`).
- `ModuleType` — a union type of the `MODULE_TYPES` values.

## Usage

```ts
import {
  moduleSchemas,
  MODULE_TYPES,
  type ModuleType,
} from "@indiecrafts/packages-web-page-builder/sanity/schema/modules";
```

## Source

`code/packages/web/page-builder/src/sanity/schema/modules/index.ts`
