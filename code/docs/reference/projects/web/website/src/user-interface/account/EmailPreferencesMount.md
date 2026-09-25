---
title: "Account email preferences mount"
description: "Signed-in account-page mount that wires the email preference centre to the JWT api route."
status: stable
---

# Account email preferences mount

> The website account-page mount for the email preference centre, using Clerk's token against the JWT consent route.

## Purpose

Client component in `src/user-interface/account`. It supplies the `read`/`write` functions for `EmailPreferences` by calling the JWT route `GET/POST /v1/consent/email-preferences` with Clerk's `getToken`. It gates on `isSignedIn` and a configured api origin, returning `null` when either is missing.

## Exports

- `EmailPreferencesMount` — React component; props `apiUrl`, `chrome`.

## Usage

```tsx
import { EmailPreferencesMount } from "@/user-interface/account/EmailPreferencesMount";

<EmailPreferencesMount apiUrl={apiUrl} chrome={chrome} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/account/EmailPreferencesMount.tsx`
