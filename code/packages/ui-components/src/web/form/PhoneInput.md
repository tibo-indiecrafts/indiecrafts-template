# PhoneInput

A lightweight international phone field: a country **dial-code `<select>`** + a national
`<input type="tel">`. Emits an **E.164-ish string** (`+33612345678`) via `onChange`. Uncontrolled
national part (keeps value parsing simple).

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `onChange` | `(value: string) => void` | Fires with the combined `+{dial}{digits}` (empty string when no digits). |
| `defaultCountry` | `string` | Initial country (ISO code, e.g. `"FR"`). Default `"FR"`. |
| `defaultNational` | `string` | Initial national number. |
| `countries` | `PhoneCountry[]` | Override the dial-code list (default `PHONE_COUNTRIES` — EU + a few EN markets). |
| `name` · `id` · `placeholder` · `required` · `disabled` · `className` | — | Passed to the `tel` input. |

## Validation

Validation is **the caller's job** — use `isPhone` / `formatPhone` from
[`@indiecrafts/format/validate`](/packages/format). For strict per-country validity, swap in
`libphonenumber-js` at the call site. Address autocomplete + payment-card fields are deliberately
**not** shipped (address = external API + privacy; cards = Stripe Elements / PCI).
