---
title: "Email strings reader"
description: "Server-only read of the emailStrings singleton plus a locale-picking helper."
status: stable
---

# Email strings reader

> Reads the `emailStrings` singleton and resolves a locale value to one string.

## Purpose

The server-only read side of the email content entity. `getEmailStrings` fetches the whole `emailStrings` document (config plus translated copy for every email group) with a React request-deduped cache. Each sender narrows the generic result to its own group with a local view type. `pick` resolves a `localeString` or `localeText` value to a single trimmed string.

## Exports

- `LocaleValue` — type for one string per locale (`Record<string, string | undefined>` or nullish).
- `OwnerAlertConfig` — stored shape of an internal `ownerAlertGroup` (recipients plus untranslated subject and translated body).
- `ConfirmationConfig` — stored shape of a subscriber-facing `confirmationGroup` (translated copy).
- `EmailStrings` — the whole singleton as a generic index of the two group shapes.
- `getEmailStrings()` — React-cached read of the singleton.
- `pick(value, locale)` — resolve a locale value to the locale's string, else default, else empty.

## Usage

```ts
import {
  getEmailStrings,
  pick,
  type OwnerAlertConfig,
} from "@indiecrafts/packages-web-email/strings";

const strings = (await getEmailStrings()) as {
  newsletterOwner?: OwnerAlertConfig;
};
const heading = pick(strings.newsletterOwner?.heading, "fr");
```

## Source

`code/packages/web/email/src/strings.ts`
