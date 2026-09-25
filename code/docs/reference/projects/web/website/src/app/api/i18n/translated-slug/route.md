---
title: "Translated slug endpoint"
description: "Resolves a content detail slug to its counterpart slug in another locale."
status: stable
---

# Translated slug endpoint

> The LocaleSwitcher uses this to jump between per-language detail slugs.

## Purpose

Resolves a content detail slug into its counterpart in another locale, using the `translation.metadata` links from `@sanity/document-internationalization`. The `LocaleSwitcher` calls it when switching language on a post, category, tag, author, or series detail page, whose slugs differ per language. It returns the target-locale path, or a null path when there is no translation — the switcher then falls back to the target locale's homepage. Responses carry CDN cache headers so this unauthenticated endpoint cannot be hammered for amplification.

## Exports

- `GET` — reads `type`, `slug`, `from`, and `to` query params and returns the resolved path.

## Source

`code/projects/web/surfaces/website/src/app/api/i18n/translated-slug/route.ts`
