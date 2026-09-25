---
title: "Delete account section"
description: "The shared account-deletion form that drives the erasure submit, with an optional step-up path."
status: stable
---

# Delete account section

> The confirm-email deletion form; Clerk-free, step-up optional.

## Purpose

The shared "Delete my account" section (web, shadcn), Clerk- and Next-free. It takes `getToken` and `apiUrl` as props and drives `submitAccountErasure`; copy is injected. A surface can inject its own `submitErasure` to add Clerk reverification step-up; otherwise the default no-step-up path runs.

## Exports

- `DeleteAccountSectionProps` (interface) — the props (`copy`, `apiUrl`, `getToken`, `onDeleted`, optional `submitErasure`).
- `DeleteAccountSection` — the deletion form (churn survey + confirm email + submit).
- Re-exports `submitAccountErasure`, `ChurnSurveyInput`, and `ErasureSelfResult` from the shared erasure client.

## Usage

```tsx
import { DeleteAccountSection } from "@indiecrafts/packages-shared-compliance/web";

<DeleteAccountSection
  copy={deleteCopy}
  apiUrl={apiUrl}
  getToken={getToken}
  onDeleted={signOut}
/>;
```

## Source

`code/packages/shared/compliance/src/web/DeleteAccountSection.tsx`
