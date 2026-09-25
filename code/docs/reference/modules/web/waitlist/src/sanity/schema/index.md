---
title: "Waitlist schema barrel"
description: "Collects the waitlist Sanity schema types — the settings singleton and the entry document."
status: stable
---

# Waitlist schema barrel

> The waitlist's registered Sanity document types, in one array.

## Purpose

Aggregates the waitlist module's schema types for Studio registration.

## Exports

- `schemaTypes` — a `SchemaTypeDefinition[]` holding `waitlistSettings` and `waitlistEntry`.

## Usage

```ts
import { schemaTypes } from "@indiecrafts/modules-web-waitlist/sanity/schema";
```

## Source

`code/modules/web/waitlist/src/sanity/schema/index.ts`
