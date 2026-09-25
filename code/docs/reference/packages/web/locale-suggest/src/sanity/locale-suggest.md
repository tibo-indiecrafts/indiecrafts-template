---
title: "Locale suggest schema"
description: "Sanity singleton schema for the language-suggestion banner copy."
status: stable
---

# Locale suggest schema

> The `localeSuggest` singleton holding the language-suggestion banner text.

## Purpose

Defines the `localeSuggest` document — a single, language-independent singleton (`_id: localeSuggest`) that holds the copy for the "this site is available in {your language}" banner. It is the sole runtime source with no fallback, read by `getLocaleSuggest`. The `{language}` token is replaced with the target language's native name. Fields are `message`, `switchLabel`, and `dismissLabel`, each a `localeString`.

## Exports

- `default` — the `defineType` schema for the `localeSuggest` document, registered through the `localeSuggestSanity` barrel.

## Usage

```ts
import localeSuggest from "@indiecrafts/packages-web-locale-suggest/sanity/locale-suggest";

// registered via schemaTypes in localeSuggestSanity
const schemaTypes = [localeSuggest];
```

## Source

`code/packages/web/locale-suggest/src/sanity/locale-suggest.ts`
