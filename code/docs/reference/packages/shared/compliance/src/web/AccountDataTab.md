---
title: "Account data tab"
description: "The account panel composing GDPR data export and account erasure from the shared sections."
status: stable
---

# Account data tab

> Export and delete, composed from the shared data sections.

## Purpose

The "Your data" account page — GDPR data export plus account erasure, composed from the shared sections (which own their own input and status). Clerk-free: the surface passes an `AccountAuth` built from its SDK. Used as a custom account page on every web surface.

## Exports

- `AccountDataTabProps` (interface) — the props (`auth`, `apiUrl`, `deleteCopy`, `exportCopy`, `showExport`).
- `AccountDataTab` — the account data panel component.

## Usage

```tsx
import { AccountDataTab } from "@indiecrafts/packages-shared-compliance/web";

<AccountDataTab
  auth={auth}
  apiUrl={apiUrl}
  deleteCopy={deleteCopy}
  exportCopy={exportCopy}
  showExport
/>;
```

## Source

`code/packages/shared/compliance/src/web/AccountDataTab.tsx`
