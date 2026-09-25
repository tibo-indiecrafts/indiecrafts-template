---
title: "Cookie category schema"
description: "Sanity object schema for one consent category in the cookie banner."
status: stable
---

# Cookie category schema

> Maps a consent category to its Google Consent Mode signals.

## Purpose

The Sanity object schema for one consent category shown in the cookie banner and preferences dialog. Required categories (necessary) are always on and cannot be toggled off. The `consentSignals` field maps the category to Google Consent Mode keys; accepting the category flips those signals to `granted`, resolved in `getCookieConsent` and pushed by the banner.

## Exports

- `default` — the `cookieCategory` Sanity object type.

## Usage

```ts
import cookieCategory from "@indiecrafts/packages-web-compliance/sanity/cookie-category";

export const schemaTypes = [cookieCategory];
```

## Source

`code/packages/web/compliance/src/sanity/cookie-category.ts`
