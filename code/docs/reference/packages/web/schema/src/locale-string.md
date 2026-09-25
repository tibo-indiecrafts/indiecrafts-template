---
title: "Locale string field"
description: "A Sanity object type that holds one short string per configured locale."
status: stable
---

# Locale string field

> Per-locale `string` field object, generated from the shared locale list.

## Purpose

Defines the `localeString` Sanity object type for short translated strings, such as menu labels and column titles. It builds one `string` field per registered locale from `@indiecrafts/packages-shared-config` `locales`, so the language set can never drift from the rest of the app. Adding a locale there grows this object a field automatically.

## Exports

- `default` — the `localeString` `defineType` object. Registered once in the shared Sanity barrel and referenced by type name.

## Usage

```ts
import { defineField, defineType } from "sanity";

defineType({
  name: "menuItem",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "localeString" }),
  ],
});
```

The read path resolves `value[locale] ?? value[defaultLocale]`, so an empty locale falls back to the default one.

## Source

`code/packages/web/schema/src/locale-string.ts`
