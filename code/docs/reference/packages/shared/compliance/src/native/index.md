---
title: "Compliance native entry"
description: "Public barrel for the React Native compliance UI and the AsyncStorage store adapter."
status: stable
---

# Compliance native entry

> The single import surface for the React Native compliance UI.

## Purpose

Re-exports the React Native compliance UI and the `AsyncStorage` store adapter for the Expo shell. The components are themed from the shared `ui-tokens`. The pure core lives in the sibling `../shared` module.

## Exports

- `ConsentBanner`, `ConsentPreferences`, `LegalReacceptancePrompt` — the consent and legal UI.
- `ExportSection` and `ExportSectionProps` — the data-export section.
- `MarketingEmailToggle` and `MarketingEmailToggleProps` — the account opt-in.
- `MarketingNudge`, `MarketingNudgeProps`, `MarketingNudgeCopy` — the one-time prompt.
- `createNativeStore` — the AsyncStorage-backed store adapter.
- `buildDeleteAccountCopy`, `buildExportCopy`, and the `DeleteAccountCopy`, `ExportCopy` types (re-exported from `../shared`).

## Usage

```ts
import {
  ConsentBanner,
  createNativeStore,
} from "@indiecrafts/packages-shared-compliance/native";
```

## Source

`code/packages/shared/compliance/src/native/index.ts`
