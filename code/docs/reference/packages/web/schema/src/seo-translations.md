---
title: "SEO translations field"
description: "Per-locale SEO overrides for a Sanity document that every locale shares."
status: stable
---

# SEO translations field

> Per-locale SEO text on a shared document, so its pages get their own title and description.

## Purpose

A singleton such as `blog`, `contactSettings`, or `waitlistSettings` renders in every locale, so its `seo` field holds one language. `seoTranslationsField()` adds a `seoTranslations` array: one entry per other locale, each with a `language` and, for each named field, the text fields of `seoMeta` (`title`, `description`, `keywords`, `llmsSummary`, `llmsFull`). Visibility, canonical, and images are not offered: they stay on the base, so a translation can never index, hide, or re-point a page. The language list is every configured locale except the default one, which the base fields hold. A custom rule allows one entry per language. The field is hidden when the site has a single locale.

## Exports

- `seoTranslationsField(fields?)` — the array field. `fields` defaults to `[{ name: "seo" }]`; the blog's `indexSeo` passes its `author`, `category`, and `tag` pages.
- `OTHER_LOCALES` — the locales an entry can pick (all but `defaultLocale`).
- `TRANSLATED_SEO_FIELDS` — the `seoMeta` fields an entry carries.

## Usage

```ts
import { defineField, defineType } from "sanity";
import { seoTranslationsField } from "@indiecrafts/packages-web-schema";

defineType({
  name: "contactSettings",
  type: "document",
  fields: [
    defineField({ name: "seo", title: "SEO & visibilité", type: "seoMeta" }),
    seoTranslationsField(),
  ],
});
```

The read side (`localizedSeo` in the website's `src/sanity/seo-queries.ts`) merges the locale's entry over the base field by field (`{ ...seo, ...seoTranslations[language == $locale][0].seo }`), so an empty field or a missing entry keeps the default-locale text.

## Source

`code/packages/web/schema/src/seo-translations.ts`
