---
title: "Email preferences page"
description: "Anonymous email-preference centre opened from an emailed token-bearing link."
status: stable
---

# Email preferences page

> The `/email-preferences` route — a signed-out recipient manages email categories via an opaque token.

## Purpose

Server route for `/<locale>/email-preferences`. It reads a `?token=` query and mounts `EmailPreferencesPublic`, which talks to the shared api's public `GET/POST /v1/email-preferences`. The route is not in the `pages` map — a utility callback kept out of nav, sitemap, and llms. It is marked `robots: { index: false, follow: false }`. Fail-safe: with no `NEXT_PUBLIC_API_URL` it returns 404, and with no token it shows the invalid-link state.

## Exports

- `generateMetadata` — title/description from `pages.emailPreferences`, no-index.
- `EmailPreferencesPage` (default) — the async server component.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/email-preferences/page.tsx`
