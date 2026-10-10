---
title: "Email contacts page"
description: "Look up a person by email, with or without an account, and turn their emails off on request."
status: stable
---

# Email contacts page

> Find anyone by email address — newsletter, waitlist, contact form or account — and see their email preferences.

## Purpose

Admin-gated (`requireAdminPage`). `?email=` looks the address up through `fetchEmailPreferences` (the api audits the view by fingerprint) and renders the shared `EmailPrefsPanel`: the Resend topics and global state, with the off-only buttons. An address that belongs to an account links to that account's email sheet on the Users page, where the sign-in email can change too. A bad address or an unreachable api shows an error, never an empty state.

## Exports

- `default` — the page (server component).

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/contacts/page.tsx`
