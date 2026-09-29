---
title: "Compliance core barrel"
description: "The public entry of the platform-agnostic compliance core, re-exporting consent, legal, geo, and erasure APIs."
status: stable
---

# Compliance core barrel

> The `/shared` public surface — pure TS, safe to import from any web surface or Worker.

## Purpose

The public entry of the platform-agnostic compliance core. It re-exports the consent math, store and legal-route contracts, the geo-to-regulation resolver, and the erasure and export clients. Zero DOM, Sanity, or Next coupling; the UI lives in `../web`.

## Exports

- Consent signals — `CONSENT_SIGNALS`, `ConsentSignal`, `ConsentCategory`, `CookieRow`, `CookieConsent`.
- Consent math — `grantedKeys`, `consentUpdate`, `DEFAULT_CONSENT_CATEGORIES`, `resolveCategories`, `acceptAllChoices`, `rejectAllChoices`, plus the `ConsentRecord` / `Store` / `ConsentStore` / `ConsentCategoryDef` / `ConsentBannerCopy` types.
- Legal routes — `LEGAL_PAGES`, `LEGAL_PAGE_KEYS`, `legalUrl`, `needsReacceptance`, plus `LegalPageKey` / `LegalAcceptanceRecord`.
- Geo to regulation — `REGULATIONS`, `CONSENT_REGIONS`, `TERRITORIES`, `resolveRegulation`, `resolveConsentMode`, plus `ConsentMode` / `Regulation` / `ConsentConfig`.
- Erasure orchestrator — `runErasure`, `runExport`, plus the adapter and receipt types.
- Erasure and export clients — `submitAccountErasure`, `rawErasureFetch`, `mapErasureResponse`, `requestExport`, plus their types.
- Account copy — `buildDeleteAccountCopy`, `buildExportCopy`, `CHURN_REASON_CODES`, plus the copy types.

## Usage

```ts
import {
  resolveConsentMode,
  legalUrl,
  submitAccountErasure,
} from "@indiecrafts/packages-shared-compliance/shared";
```

## Source

`code/packages/shared/compliance/src/shared/index.ts`
