---
title: "Account control"
description: "Wires the shared unified account modal for the app surface, as a button trigger or a full page."
status: stable
---

# Account control

> The shared account modal, wired for the app surface.

## Purpose

Client component that wires the shared unified account modal for the app. It builds the copy and consent categories from `messages` and config (the same ones the app banner uses). A Privacy-tab save is logged server-side through `reportConsent` → `/api/consent-log` (signed-in users). Then it renders either the sidebar-footer trigger (`button` variant) or the `/account` full-page fallback (`page` variant). It replaces the old `AccountDeletePanel` and `CookiePreferencesSection`, and mirrors the website's `AccountControl`.

## Exports

- `AccountControl` — the client component. Prop: `variant` (`"button"` or `"page"`).

## Usage

```tsx
import { AccountControl } from "@/user-interface/account/AccountControl";

<AccountControl variant="button" />;
```

## Source

`code/projects/web/surfaces/app/src/user-interface/account/AccountControl.tsx`
