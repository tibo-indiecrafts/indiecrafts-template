---
title: "Account section copy"
description: "Copy contracts and pure builders for the shared delete-account and export sections."
status: stable
---

# Account section copy

> The copy contracts and builders shared by the web account sections.

## Purpose

Defines the copy contracts for the shared account sections and pure builders that assemble them from a namespace-scoped translator. It lives in `shared` (no React) so the web section components and the builders reference one type. Each surface passes a `t` already scoped to `account.delete` or `account.export`, so the builders work regardless of the i18n runtime.

## Exports

- `CHURN_REASON_CODES` / `ChurnReasonCode` — the preset churn reason codes. This is the single source: the survey UI, the api's `normalizeReason` and the admin churn page all import it.
- `DeleteAccountSurveyCopy` — the churn exit-survey copy shape.
- `DeleteAccountCopy` — the delete-account section copy shape (includes `survey`).
- `ExportCopy` — the export section copy shape.
- `buildDeleteAccountCopy(t)` — assembles `DeleteAccountCopy` from a scoped translator.
- `buildExportCopy(t)` — assembles `ExportCopy` from a scoped translator.

## Usage

```ts
import { buildExportCopy } from "@indiecrafts/packages-shared-compliance/shared";

const copy = buildExportCopy(useTranslations("account.export"));
```

## Source

`code/packages/shared/compliance/src/shared/account-copy.ts`
