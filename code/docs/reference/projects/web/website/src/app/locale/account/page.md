---
title: "Account page route"
description: "Self-service account route that renders the unified account modal full-page for a signed-in user."
status: stable
---

# Account page route

> The `/[locale]/account` route: the account modal rendered full-page, plus the email preference centre.

## Purpose

Renders `AccountControl` in its `page` variant (Clerk `<UserProfile>` with the Privacy & consent and Your data tabs), the same experience that opens from the header avatar. Below it, a website-only email preference centre mounts through `EmailPreferencesMount`. The route is gated by `features.account.delete` (`isPageVisible`), Clerk being configured, a client API origin, and a signed-in user — a signed-out visitor is redirected home.

## Exports

- `generateMetadata` — builds SEO metadata for the account page from `pages.account`.
- `AccountPage` (default) — the gated account server component.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/account/page.tsx`
