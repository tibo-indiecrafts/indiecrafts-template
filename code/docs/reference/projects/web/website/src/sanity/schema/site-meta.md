---
title: "Per-locale site SEO schema"
description: "Sanity document schema for the per-locale site-wide SEO singleton (siteMeta.<lang>)."
status: stable
---

# Per-locale site SEO schema

> The `siteMeta.<locale>` singleton: site-wide SEO defaults, system-page copy, and the llms.txt summary for one language.

## Purpose

Defines the `siteMeta` Sanity document — a fixed-id singleton per locale (`siteMeta.en`, `siteMeta.fr`). It holds the site tagline, description, keywords, default Open Graph card, taxonomy-index copy, system-page copy (maintenance + 404), the version-update banner, and the llms.txt summary. It is the sole runtime source for this text (no `messages`/`config` fallback), read by `getSiteSeo`. Per-page SEO is not here — each rendering doc carries its own `.seo`.

## Exports

- `default` — the `defineType` object for the `siteMeta` document (registered in the Studio's "SEO & métadonnées" desk section).

## Source

`code/projects/web/surfaces/website/src/sanity/schema/site-meta.ts`
