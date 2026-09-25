---
title: "Locale string resolver"
description: "Resolves a per-locale blog string with a fallback."
status: stable
---

# Locale string resolver

> A blog-typed adapter over the shared `pickLocale`.

## Purpose

Resolves a `localeString` value (`{ en, fr }`) for the active locale, falling back to the default locale, then a caller-supplied default. It is a thin blog-typed wrapper over the shared `pickLocale`, so editor-managed per-locale copy renders the same way everywhere.

## Exports

- `localized(value, locale, fallback?)` — the resolved string.

## Usage

```ts
import { localized } from "@indiecrafts/modules-web-blog/lib/localize";

const title = localized(category.title, locale, "Untitled");
```

## Source

`code/modules/web/blog/src/lib/localize.ts`
