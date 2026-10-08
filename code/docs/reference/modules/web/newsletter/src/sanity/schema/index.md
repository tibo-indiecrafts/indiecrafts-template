---
title: "Newsletter schema barrel"
description: "Collects the newsletter module's Sanity schema types."
status: stable
---

# Newsletter schema barrel

> The list of Sanity document types the newsletter module registers.

## Purpose

Collects the newsletter module's Sanity schema definitions — `newsletterSettings` and `leadMagnet` — into one array for the `newsletterSanity` barrel to register.

## Exports

- `schemaTypes` — `SchemaTypeDefinition[]` with the newsletter settings singleton and the lead-magnet type.

## Source

`code/modules/web/newsletter/src/sanity/schema/index.ts`
