---
title: "Consent core"
description: "The portable consent decision math, store contract, and default category taxonomy shared by every shell."
status: stable
---

# Consent core

> Pure consent math and taxonomy — no DOM, no storage, forked UI reads it.

## Purpose

The platform-agnostic consent core: the decision math, the persistence contract a shell implements, and the default category set. Shared by the web and native shells; each supplies its own storage adapter and localized copy.

## Exports

- `ConsentRecord` (type) — the stored record: `v` version, `t` timestamp, `choices` per category key.
- `Store<T>` (interface) — the persistence contract a shell implements (`get` / `save` / `subscribe`).
- `ConsentStore` (type) — a `Store` of `ConsentRecord`.
- `grantedKeys` — the category keys currently granted (required categories are always granted).
- `consentUpdate` — the gtag Consent-Mode `update` payload for a set of choices.
- `ConsentCategoryDef` (type) — one category's signal mapping, with no copy.
- `DEFAULT_CONSENT_CATEGORIES` — the default taxonomy (`necessary` / `analytics` / `marketing`).
- `resolveCategories` — merge localized copy into the taxonomy.
- `ConsentBannerCopy` (type) — the injected banner copy shape.
- `acceptAllChoices` — every non-required category granted.
- `rejectAllChoices` — every non-required category denied.

## Usage

```ts
import {
  DEFAULT_CONSENT_CATEGORIES,
  acceptAllChoices,
  consentUpdate,
} from "@indiecrafts/packages-shared-compliance/shared";

const choices = acceptAllChoices(DEFAULT_CONSENT_CATEGORIES);
const payload = consentUpdate(DEFAULT_CONSENT_CATEGORIES, choices);
// → { ad_storage: "granted", analytics_storage: "granted", ... }
```

## Source

`code/packages/shared/compliance/src/shared/consent.ts`
