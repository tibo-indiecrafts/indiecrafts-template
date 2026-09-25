---
title: "Global schema object"
description: "The Sanity object schema for one extra site-wide JSON-LD entity in siteSettings.globalSchemas."
status: stable
---

# Global schema object

> An editor-picked JSON-LD entity added to the site graph.

## Purpose

Defines the `globalSchema` object — one extra site-wide JSON-LD entity added to the site graph alongside the auto-emitted Organization and WebSite. The editor picks a `schemaType` (Service, Product, Person, Event); the front-end maps it through the matching factory in `src/lib/seo/jsonld-factories.tsx`. It lives in `siteSettings.globalSchemas[]` and is the sole source for these entries.

## Exports

- `default` — the `globalSchema` object type definition (a Sanity `defineType`).

## Source

`code/projects/web/surfaces/website/src/sanity/schema/objects/global-schema.ts`
