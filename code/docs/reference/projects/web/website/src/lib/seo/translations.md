---
title: "Cross-locale slug resolution"
description: "Resolves a content slug to its other-locale path and lists a page's real translation alternates from Sanity."
status: stable
---

# Cross-locale slug resolution

> Follows the document-i18n links to map a slug across locales.

## Purpose

Server-only. Reads the `translation.metadata` links kept by `@sanity/document-internationalization` to resolve content slugs across locales. One home for the four consumers: the locale switcher, a detail page's `hreflang` alternates, the sitemap, and the detail pages' not-found redirect. Uses the published client, so it is build-safe.

## Exports

- `SLUG_FIELD` — map of each translated type to its GROQ slug field.
- `translatedSlugPath(type, slug, from, to)` — the target-locale path for a detail slug, or `null` when there is no translation.
- `translationFallbackPath(type, slug, locale)` — the `locale` path of a slug that only exists in another locale (its translation), or `null`.
- `redirectToTranslation(type, slug, locale)` — a detail page's not-found branch: redirects to that translation, else `notFound()`. The locale cookie sends `/blog/<en-slug>` to `/fr/blog/<en-slug>`; this lands the visitor on the French post instead of a 404.
- `translationAlternates(type, slug, locale)` — absolute per-locale URLs for a page's real translations, keyed by locale.

## Usage

```ts
import { translatedSlugPath } from "@/lib/seo/translations";

const path = await translatedSlugPath("post", slug, "en", "fr");
```

## Source

`code/projects/web/surfaces/website/src/lib/seo/translations.ts`
