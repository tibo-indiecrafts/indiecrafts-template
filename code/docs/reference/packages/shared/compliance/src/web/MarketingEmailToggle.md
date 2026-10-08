---
title: "Marketing email toggle"
description: "The server-backed account switch for the commercial-email opt-in."
status: stable
---

# Marketing email toggle

> A server-backed opt-in switch; optimistic, reverts on failure.

## Purpose

The account-settings toggle for the commercial-email opt-in. It reads the current value from the api consent route and writes each change back, so the server records the proof and sets the email-preference categories (yes → the sign-up ones, no → all), which syncs Resend. Server-backed (distinct from the localStorage cookie categories) and optimistic — it reverts on a failed write. An empty `apiUrl` renders nothing.

## Exports

- `MarketingEmailToggleProps` (interface) — the props (`apiUrl`, `getToken`, `label`, `surface`, optional `onSaved`).
- `MarketingEmailToggle` — the opt-in switch component.

## Usage

```tsx
import { MarketingEmailToggle } from "@indiecrafts/packages-shared-compliance/web";

<MarketingEmailToggle
  apiUrl={apiUrl}
  getToken={getToken}
  label={t("commercialEmails")}
  surface="account"
/>;
```

## Source

`code/packages/shared/compliance/src/web/MarketingEmailToggle.tsx`
