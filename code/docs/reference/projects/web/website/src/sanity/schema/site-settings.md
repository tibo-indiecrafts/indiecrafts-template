---
title: "Site settings schema"
description: "Sanity document schema for the language-independent site settings singleton (siteSettings)."
status: stable
---

# Site settings schema

> The `siteSettings` singleton: fill-once, language-independent SEO data — brand, social profiles, the schema.org business entity, indexing, theme, and share controls.

## Purpose

Defines the `siteSettings` Sanity document — a single language-independent singleton (`_id: siteSettings`). It holds the brand logo/icon, social profiles, the schema.org business type with its address/contact/geo fields, extra global JSON-LD entities, site-wide indexing and maintenance flags, theme modes, analytics/cookie settings, and footer share/credit blocks. It is the sole runtime source for these values, read by `getSiteSettings` and fed to `buildSiteSchemas`. Per-language SEO text lives in the separate `siteMeta` singleton.

## Exports

- `default` — the `defineType` object for the `siteSettings` document.

## Source

`code/projects/web/surfaces/website/src/sanity/schema/site-settings.ts`
