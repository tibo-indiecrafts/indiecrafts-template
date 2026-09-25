---
title: "Locale text field"
description: "Sanity object primitive with one multi-line text field per registered locale."
status: stable
---

# Locale text field

> Field-level i18n for multi-line text, generated from the shared locale set.

## Purpose

Defines the `localeText` Sanity object: the multi-line sibling of `localeString`. It generates one `type: "text"` field per registered locale from `@indiecrafts/packages-shared-config` `locales`, so the language set can never drift. The read path resolves `value[locale] ?? value[defaultLocale]`.

## Exports

- `default` (`localeText`) — a Sanity object type with one 3-row `text` field per locale.

## Usage

```ts
import { defineField } from "sanity";

defineField({ name: "body", title: "Body", type: "localeText" });
```

## Source

`code/packages/web/schema/src/locale-text.ts`
