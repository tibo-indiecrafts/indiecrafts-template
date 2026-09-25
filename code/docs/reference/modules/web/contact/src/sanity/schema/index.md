---
title: "Contact schema types"
description: "Barrel that collects the contact module's Sanity schema types into one array."
status: stable
---

# Contact schema types

> The contact module's schema barrel — the settings singleton plus the message document.

## Purpose

This barrel collects the contact module's Sanity schema types into a single `schemaTypes` array: `contactSettings` (the singleton) and `contactMessage` (the inbox record). It is consumed by the `contactSanity` factory when it builds the module's `SanityModule`.

## Exports

- `schemaTypes` — `SchemaTypeDefinition[]` containing `contactSettings` and `contactMessage`.

## Usage

```ts
import { schemaTypes } from "@indiecrafts/modules-web-contact/sanity/schema";
```

## Source

`code/modules/web/contact/src/sanity/schema/index.ts`
