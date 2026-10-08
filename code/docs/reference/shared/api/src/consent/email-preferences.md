---
title: "Email-preference routes"
description: "Authenticated and no-login email-preference routes plus the RFC 8058 one-click unsubscribe."
status: stable
---

# Email-preference routes

> Two ways in — Clerk JWT or a signed email-link token — over shared read/write internals.

## Purpose

Serves the per-category email-preference routes. There are two ways in: authenticated via a Clerk JWT (the account preference centre and mobile) and no-login via a signed pref-token from an email link (the preference centre and RFC 8058 one-click unsubscribe). Both share the same read-state and apply-updates internals — category merge, the D1 store, and a best-effort Resend Topics mirror — differing only in how the caller's user id is established.

## Exports

- `EmailPreferencesDeps` — injectable dependencies for tests: `authenticate`, `fetchCategories`, `sync`.
- `handleEmailPreferences(request, env, ctx?, deps?)` — the authenticated GET/POST route.
- `handleTokenPreferences(request, env, ctx?, deps?)` — the no-login GET/POST route, keyed by a signed pref-token.
- `handleOneClickUnsubscribe(request, env, ctx?, deps?)` — the RFC 8058 `List-Unsubscribe-Post` target; always 200s on a valid token.
- `applyMarketingDecision({ env, db, userId, locale, granted, surface, country, ctx?, deps? })` — the single "commercial emails" yes/no as category writes: yes → the `includeAtSignup` categories (else `news`), no → every category. The sign-up webhook and `/v1/consent/marketing-email` call it, so `marketing_email` stays a derived cache.
- `emailPreferenceLinks(env, uid, cat?)` — builds the manage and unsubscribe URLs plus the `List-Unsubscribe` headers for an outbound email.

## Usage

```ts
import { handleEmailPreferences } from "./consent/email-preferences";

if (url.pathname === "/v1/consent/email-preferences")
  return handleEmailPreferences(request, env, ctx);
```

## Source

`code/shared/api/src/consent/email-preferences.ts`
