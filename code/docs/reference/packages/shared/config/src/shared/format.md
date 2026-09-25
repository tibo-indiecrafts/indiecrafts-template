---
title: "Format defaults"
description: "Site-wide formatting fallbacks and the per-locale format resolver for money, number, and grammar."
status: stable
---

# Format defaults

> Site-wide `Intl` format defaults and their per-locale resolution.

## Purpose

Holds the site-wide formatting fallbacks for `@indiecrafts/packages-shared-format` (money, number, date, grammar). Per-locale overrides live on each `i18n.locales` row; these are the defaults when a row omits one. `rates` is the currency-conversion table, empty by default.

## Exports

- `formatDefaults` — the site-wide defaults: `currency` (`"EUR"`), `vatRate` (`0.2`), and `rates` (a `"FROM>TO"` keyed conversion map, empty by default).
- `localeFormat(locale)` — resolves a locale's formatting rules by merging its `i18n.locales` row over the defaults, returning `numberLocale`, `currency`, `capitalizeInlineNouns`, and `adjBeforeNoun`.

## Usage

```ts
import { localeFormat } from "@indiecrafts/packages-shared-config/shared";

const { currency, numberLocale } = localeFormat("fr");
```

## Source

`code/packages/shared/config/src/shared/format.ts`
