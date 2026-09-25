---
title: "Identity validators"
description: "Pure validators and formatters for email, phone, postal code, IBAN, and EU VAT number."
status: stable
---

# Identity validators

> Dependency-free checks and formatters for contact and identity fields.

## Purpose

Validates and formats common identity and contact values with no dependencies. Phone validity is a loose E.164 shape; for strict per-country validation, swap in `libphonenumber-js` at the call site.

## Exports

- `isEmail(s)` — loose email shape check.
- `isPhone(input)` — loose E.164 check after stripping separators.
- `formatPhone(input)` — light international grouping of a phone number.
- `isPostalCode(code, country)` — per-country postal-code check with a permissive default.
- `isIban(input)` — IBAN check-digit validation (mod-97).
- `formatIban(input)` — group an IBAN into 4-character blocks.
- `isVatNumber(input)` — EU VAT number shape check (format only, not VIES-checked).

## Usage

```ts
import {
  isEmail,
  isIban,
  formatPhone,
} from "@indiecrafts/packages-shared-format/validate";

isEmail("a@b.com"); // true
isIban("FR76 3000 6000 0112 3456 7890 189");
formatPhone("+33612345678");
```

## Source

`code/packages/shared/format/src/validate.ts`
