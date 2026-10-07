---
title: "Consent cookie"
description: "First-party cookie that mirrors the decided consent version so the server can render the banner."
status: stable
---

# Consent cookie

> The decided consent version, readable by the server.

## Purpose

Cookie choices live in `localStorage`, which the server can't read, so the banner used to appear only after hydration — late enough to be the home page's largest paint. `consentStore.save` now also writes the decided `version` (never the choices) into `<site.prefix>.consent-v`. The layout compares it with the current version and passes `decided` to `CookieBanner`, which then renders in the first HTML for an undecided visitor. First-party, `SameSite=Lax`, `Secure` on https, 1-year max-age; strictly necessary and declared in the cookie inventory like `legal-ack`. Framework-free, so a server component can import the name.

## Exports

- `CONSENT_COOKIE` — the cookie name, namespaced by `site.prefix`.
- `writeConsentCookie(version)` — writes it (client-side; a no-op on the server).

## Source

`code/packages/web/compliance/src/consent/consent-cookie.ts`
