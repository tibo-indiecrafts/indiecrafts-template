---
title: "Locale suggest copy reader"
description: "Server-only, React-cached read of the localeSuggest singleton resolved to one locale."
status: stable
---

# Locale suggest copy reader

> Reads the `localeSuggest` singleton and resolves its copy to one locale.

## Purpose

The Sanity-only reader for the language-suggestion copy. The `localeSuggest` singleton is the sole runtime source — there is no `messages` fallback, per the content-in-Sanity rule. It fetches the singleton, resolves each `localeString` to the requested locale, and returns an empty object on any error. The read is React-cached.

## Exports

- `LocaleSuggestCopy` — type with optional `message`, `switchLabel`, and `dismissLabel` strings.
- `getLocaleSuggest(locale)` — React-cached read returning the resolved copy for the locale.

## Usage

```ts
import { getLocaleSuggest } from "@indiecrafts/packages-web-locale-suggest/sanity/reader";

const copy = await getLocaleSuggest("fr");
```

## Source

`code/packages/web/locale-suggest/src/sanity/reader.ts`
