---
title: "Public email preferences mount"
description: "No-login mount that wires the email preference centre to the public token api route."
status: stable
---

# Public email preferences mount

> The no-login token mount for the email preference centre, reading and writing against the public token route.

## Purpose

Client component in `src/user-interface/email-preferences`. It supplies the `read`/`write` functions for `EmailPreferences` by calling the token route `GET/POST /v1/email-preferences?token=…`. The `token` is opaque (from the URL) and is sent only in the query string or body, never rendered.

## Exports

- `EmailPreferencesPublic` — React component; props `apiUrl`, `token`, `chrome`.

## Usage

```tsx
import { EmailPreferencesPublic } from "@/user-interface/email-preferences/EmailPreferencesPublic";

<EmailPreferencesPublic apiUrl={apiUrl} token={token} chrome={chrome} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/email-preferences/EmailPreferencesPublic.tsx`
