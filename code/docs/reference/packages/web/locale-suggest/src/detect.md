---
title: "Preferred locale detector"
description: "Pure detector returning the top-ranked Accept-Language locale that differs from the active one."
status: stable
---

# Preferred locale detector

> Picks the visitor's top supported language when it differs from the active locale.

## Purpose

A pure, framework-free locale-preference detector that is cheap to unit-test. next-intl already redirects a first visit to `/` to the browser language, so this targets the residual mismatch: a returning visitor or a shared `/fr/…` link whose active locale differs from the browser's. Only the `Accept-Language` HTTP parser is web-specific; the ranked-preference decision delegates to shared `pickSuggestedLocale`, so native shells reuse it.

## Exports

- `detectPreferredLocale(acceptLanguage, active, locales)` — returns the top-ranked supported locale that differs from `active`, or `null` when the first supported preference already matches.

## Usage

```ts
import { detectPreferredLocale } from "@indiecrafts/packages-web-locale-suggest/detect";

const suggested = detectPreferredLocale("fr-FR,en;q=0.8", "en", ["en", "fr"]);
```

## Source

`code/packages/web/locale-suggest/src/detect.ts`
