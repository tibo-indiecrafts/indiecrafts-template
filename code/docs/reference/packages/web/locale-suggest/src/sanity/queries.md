---
title: "Locale suggest GROQ"
description: "GROQ query for the localeSuggest singleton."
status: stable
---

# Locale suggest GROQ

> The GROQ that reads the `localeSuggest` singleton.

## Purpose

Holds the GROQ query for the `localeSuggest` singleton, selecting `message`, `switchLabel`, and `dismissLabel`. The `localeString` values are resolved per request in `getLocaleSuggest` (`./reader`). `defineQuery` flags it for Sanity typegen.

## Exports

- `localeSuggestQuery` — the `defineQuery` string reading the `localeSuggest` singleton's copy fields.

## Usage

```ts
import { localeSuggestQuery } from "@indiecrafts/packages-web-locale-suggest/sanity/queries";

const data = await client.fetch(localeSuggestQuery);
```

## Source

`code/packages/web/locale-suggest/src/sanity/queries.ts`
