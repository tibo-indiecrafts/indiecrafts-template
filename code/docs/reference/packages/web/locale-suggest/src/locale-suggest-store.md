---
title: "Locale suggest dismiss cookie"
description: "First-party cookie that records the visitor answered the language suggestion."
status: stable
---

# Locale suggest dismiss cookie

> A small first-party cookie so the server stops showing the suggestion once answered.

## Purpose

Records that the visitor answered the language suggestion, by switching or declining, so the server stops showing it. It mirrors the consent and announcement cookie stores. The cookie is namespaced by `site.prefix` and lives for one year; its presence means do not suggest again.

## Exports

- `LOCALE_SUGGEST_COOKIE` — the cookie name, namespaced by `site.prefix`.
- `dismissLocaleSuggest()` — writes the cookie client-side on switch or dismiss.

## Usage

```ts
import { dismissLocaleSuggest } from "@indiecrafts/packages-web-locale-suggest/locale-suggest-store";

dismissLocaleSuggest();
```

## Source

`code/packages/web/locale-suggest/src/locale-suggest-store.ts`
