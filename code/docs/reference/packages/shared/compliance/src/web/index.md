---
title: "Web compliance entry"
description: "Barrel for the DOM (shadcn) compliance UI, the localStorage store adapter, and the browser opt-out signals."
status: stable
---

# Web compliance entry

> The `./web` public surface of `@indiecrafts/packages-shared-compliance`.

## Purpose

Re-exports the DOM (shadcn) compliance UI plus the `localStorage` store adapter and browser opt-out signals. It is Next-free, so the `app` web surface consumes it. The pure decision core lives in `../shared`.

## Exports

- `ConsentBanner`, `ConsentPreferences`, `LegalReacceptancePrompt` — the consent + legal-reacceptance UI.
- `createWebStore` — the `localStorage`-backed store adapter.
- `browserSignalsDeny`, `signalsDeny` — Global Privacy Control / Do-Not-Track opt-out checks.
- `DeleteAccountSection`, `submitAccountErasure`, `ChurnSurvey`, `ExportSection` — the account-data bodies.
- `AccountDataTab`, `AccountConsentTab` — the account-settings tabs.
- `MarketingNudge` — the one-time sign-in prompt for the marketing-email opt-in.
- `buildDeleteAccountCopy`, `buildExportCopy`, `CHURN_REASON_CODES`, `rawErasureFetch`, `mapErasureResponse` — re-exported copy builders and erasure helpers from `../shared`.
- Types: `DeleteAccountSectionProps`, `ErasureSelfResult`, `ChurnSurveyProps`, `ChurnSurveyCopy`, `ExportSectionProps`, `AccountDataTabProps`, `AccountConsentTabProps`, `MarketingEmailToggleProps`, `MarketingNudgeProps`, `MarketingNudgeCopy`, `AccountAuth`, `ErasureFetchOutcome`, `ChurnSurveyInput`, `ChurnReasonCode`, `DeleteAccountCopy`, `DeleteAccountSurveyCopy`, `ExportCopy`.

## Usage

```tsx
import {
  ConsentBanner,
  createWebStore,
} from "@indiecrafts/packages-shared-compliance/web";

const store = createWebStore("indiecrafts_consent");
```

## Source

`code/packages/shared/compliance/src/web/index.ts`
