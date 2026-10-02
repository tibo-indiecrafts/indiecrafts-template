---
title: "Account consent tab"
description: "The account panel that re-opens and changes cookie-consent choices, writing the same record the banner reads."
status: stable
---

# Account consent tab

> Re-open cookie-consent choices from the account; one shared storage record.

## Purpose

The "Privacy & consent" account page. It re-opens and changes cookie-consent choices, writing the same `localStorage` record the banner and gate read (shared `storageKey` + change event), so a save here is picked up everywhere. Clerk-free; copy, categories, and version are injected.

## Exports

- `AccountConsentTabProps` (interface) — the component props (`storageKey`, `version`, `categories`, copy, `onSaved`). `onSaved(choices, version)` receives what was saved, so the surface applies it its own way: the website runs `applyConsent` (change event, Consent-Mode update, server log), the app `reportConsent` (server log).
- `AccountConsentTab` — the account consent panel component.

## Usage

```tsx
import { AccountConsentTab } from "@indiecrafts/packages-shared-compliance/web";

<AccountConsentTab
  storageKey={`${prefix}.cookie-consent`}
  version={policyVersion}
  categories={categories}
  title={t("title")}
  saveLabel={t("save")}
/>;
```

## Source

`code/packages/shared/compliance/src/web/AccountConsentTab.tsx`
