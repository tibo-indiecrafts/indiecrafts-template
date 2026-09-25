---
title: "Marketing email toggle (native)"
description: "The React Native account-settings toggle for the commercial-email opt-in."
status: stable
---

# Marketing email toggle (native)

> The native account-settings opt-in for commercial email.

## Purpose

Renders the commercial-email opt-in toggle in React Native. It reads `GET /v1/consent/marketing-email` on mount and writes each change with `POST` (recording proof plus the profile flag and Resend sync). It is the native mirror of the web `MarketingEmailToggle`. The write is optimistic and reverts on failure. It renders nothing when `apiUrl` is empty.

## Exports

- `MarketingEmailToggle` — the toggle component.
- `MarketingEmailToggleProps` — its props type: `apiUrl`, `getToken`, `label`, `surface`, optional `onSaved`.

## Usage

```tsx
import { MarketingEmailToggle } from "@indiecrafts/packages-shared-compliance/native";

<MarketingEmailToggle
  apiUrl={apiUrl}
  getToken={getToken}
  label={label}
  surface="mobile"
/>;
```

## Source

`code/packages/shared/compliance/src/native/MarketingEmailToggle.tsx`
