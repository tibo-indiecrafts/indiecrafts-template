---
title: "App account page"
description: "Self-service account route rendering the account modal full-page."
status: stable
---

# App account page

> The account experience, rendered as a full page.

## Purpose

The self-service account route on the app surface. It renders `<AccountControl variant="page">` — the Clerk `<UserProfile>` with the Privacy & consent, Emails, Language and Your data tabs — the same experience that opens from the sidebar avatar. It 404s unless `features.deleteAccount` is on, Clerk is configured, and the client API origin is set; the `(app)` layout redirects signed-out users to sign-in.

## Exports

- `default` — the `AccountPage` route component.

## Source

`code/projects/web/surfaces/app/src/app/[locale]/(app)/account/page.tsx`
