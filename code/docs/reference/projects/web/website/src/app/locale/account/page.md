---
title: "Account page route"
description: "Self-service account route that renders the unified account modal full-page for a signed-in user."
status: stable
---

# Account page route

> The `/[locale]/account` route: the account modal rendered full-page, centred.

## Purpose

Renders `AccountControl` in its `page` variant (Clerk `<UserProfile>` with the Privacy & consent, Emails, Language and Your data tabs), centred in the page — the same experience that opens from the header avatar. The email preference centre is the widget's Emails tab (`/account#/emails`). The route is gated by `features.account.delete` (`isPageVisible`), Clerk being configured, a client API origin, and a signed-in user — a signed-out visitor is redirected home. `AccountControl` sits inside `RequireClerk`: a signed-in visitor always has Clerk from the layout, but one who signed in from another tab and arrives client-side gets a single reload.

## Exports

- `generateMetadata` — builds SEO metadata for the account page from `pages.account`.
- `AccountPage` (default) — the gated account server component.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/account/page.tsx`
