---
title: "Money formatting"
description: "Locale-aware currency display plus conversion and VAT math for money amounts."
status: stable
---

# Money formatting

> Display and compute money amounts, never hardcoding rates.

## Purpose

Splits money into a display path and a compute path. `formatMoney` renders a currency string with a memoized `Intl.NumberFormat`. `convert` and `withVat` do the math, reading rates and VAT from `formatDefaults`. Amounts are major units by default; pass `cents: true` for minor-unit inputs.

## Exports

- `MoneyOptions` — options type for `formatMoney`: `locale`, `currency` (ISO 4217), and `cents`.
- `formatMoney(amount, options?)` — render a localized currency string.
- `parseMoney(input)` — parse a loose money string, handling EU and US separators.
- `toMajor(cents)` — divide minor units by 100.
- `toCents(major)` — multiply major units by 100 and round.
- `convert(amount, { from, to, rates? })` — convert between currencies; throws when no rate exists.
- `withVat(net, rate?)` — gross (TTC) from net (HT).
- `netFromGross(gross, rate?)` — net (HT) from gross (TTC).

## Usage

```ts
import {
  formatMoney,
  convert,
  withVat,
} from "@indiecrafts/packages-shared-format/money";

formatMoney(1234.5, { locale: "fr", currency: "EUR" }); // "1 234,50 €"
convert(100, { from: "EUR", to: "USD" });
withVat(100); // gross from a net amount
```

## Source

`code/packages/shared/format/src/money.ts`
