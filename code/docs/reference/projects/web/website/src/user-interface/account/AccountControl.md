---
title: "Account control"
description: "Client wrapper that wires the shared unified account modal for the website surface."
status: stable
---

# Account control

> Wires the shared account modal for the website, rendering either the header trigger or the `/account` full-page fallback.

## Purpose

Client component in `src/user-interface/account`. It builds the account copy from `messages` and `@/config`, and takes the consent categories + version from the banner's Sanity document (`useCookieConsentConfig`; the message-based defaults when Sanity has none). A Privacy-tab save runs the banner's own `applyConsent` (change event, Consent-Mode update, server-side log). Then it renders the shared `@indiecrafts/packages-web-auth/account` UI. The `variant` prop chooses the header trigger (`button`) or the `/account` full-page fallback (`page`). It replaces the old `AccountDeletePanel`.

## Exports

- `AccountControl` — React component; prop `variant` is `"button" | "page"`.

## Usage

```tsx
import { AccountControl } from "@/user-interface/account/AccountControl";

<AccountControl variant="button" />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/account/AccountControl.tsx`
