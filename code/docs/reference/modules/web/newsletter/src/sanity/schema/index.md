---
title: "Newsletter schema barrel"
description: "Collects the newsletter module's Sanity schema types."
status: stable
---

# Newsletter schema barrel

> The list of Sanity document types the newsletter module registers.

## Purpose

Collects the newsletter module's Sanity schema definitions — `newsletterSettings`, `subscriber`, and `leadMagnet` — into one array for the `newsletterSanity` barrel to register.

## Exports

- `schemaTypes` — `SchemaTypeDefinition[]` with the newsletter settings singleton, subscriber, and lead-magnet types.

## Source

`code/modules/web/newsletter/src/sanity/schema/index.ts`
