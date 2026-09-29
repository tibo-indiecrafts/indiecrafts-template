---
title: "SignedInLegalNotice"
description: "Clerk-connected wrapper for the legal re-acceptance banner — supplies getToken so a signed-in visitor's acceptance syncs across surfaces."
status: stable
---

# SignedInLegalNotice

> The website's half of cross-surface legal acceptance: a signed-in visitor sees the banner clear once they accepted anywhere.

## Purpose

Wraps `LegalNotice` (`@indiecrafts/packages-web-compliance`) with Clerk's `getToken`, so a **signed-in** visitor's legal acceptance syncs across website · app · mobile via the api Worker's `/v1/consent/legal` route: the server-recorded version hides the banner here, and accepting here records it. This keeps `LegalNotice` itself Clerk-free — the token getter is injected.

Rendered **only** when a publishable key is set (a `ClerkProvider` exists), so `useAuth` always has its provider. Anonymous or no-Clerk builds mount the plain `LegalNotice` (cookie-only) instead. The layout's server-side cookie gate still handles the common anonymous case with no flash; this wrapper only adds the signed-in cross-surface case.

It keys the banner on the Clerk user id. Sign-in is a client-side navigation, so the banner stays mounted; the key remounts it, and the server acceptance is re-read for the new identity.

## Exports

- `SignedInLegalNotice(props)` — same props as `LegalNotice` (`version`, `message`, `hrefs`, `acceptLabel`) plus `apiUrl`; injects `getToken` from `useAuth`.

## Source

`code/projects/web/surfaces/website/src/user-interface/legal/SignedInLegalNotice.tsx`
