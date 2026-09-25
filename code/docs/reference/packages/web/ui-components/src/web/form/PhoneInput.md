---
title: "Phone input"
description: "Lightweight international phone field pairing a country dial-code select with a national-number input."
status: stable
---

# Phone input

> A country dial-code select plus a national-number field that emits an E.164-ish string.

## Purpose

`PhoneInput` is a lightweight international phone field: a country dial-code `<select>` beside a national-number `<input type="tel">`. It emits an E.164-ish string such as `+33612345678` via `onChange`. Validation is the caller's job — use `isPhone` / `formatPhone` from `@indiecrafts/packages-shared-format/validate`. The national part is uncontrolled; pass `defaultCountry` / `defaultNational` for initial values.

## Exports

- `PhoneCountry` — type: one country entry (`code`, `name`, `dial`, `flag`).
- `PHONE_COUNTRIES` — the default country set (EU plus common English-speaking markets), editable.
- `PhoneInputProps` — type: the component props.
- `PhoneInput(props)` — the phone field component.

## Usage

```tsx
import { PhoneInput } from "@indiecrafts/packages-web-ui-components/web/form/PhoneInput";

<PhoneInput defaultCountry="FR" onChange={(value) => setPhone(value)} />;
```

## Source

`code/packages/web/ui-components/src/web/form/PhoneInput.tsx`
