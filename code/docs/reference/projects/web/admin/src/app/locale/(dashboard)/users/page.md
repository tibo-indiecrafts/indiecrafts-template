---
title: "Users page"
description: "Admin route that browses and searches Clerk users and shows each user's marketing-email consent."
status: stable
---

# Users page

> The admin screen for browsing Clerk users and their email consent.

## Purpose

This is the `/users` segment of the admin dashboard. It lists and searches Clerk users server-side (the admin app holds the Clerk secret), ordered newest first. For the listed user ids it also fetches the marketing-email opt-in from the shared api; that fetch fails open, so a consent error never breaks the list. Both reads live in `@/lib/users`.

Each row opens two side sheets: **Consent** (`?consent=<id>`, the read-only history, audited) and **Emails** (`?emails=<id>`, the `EmailPrefsSheet`: the email preferences with off-only overrides and the sign-in email change; the api audits the view).

## Exports

- `default` — `UsersPage`, an async server component for the admin `/users` route. It reads the `q`, `consent` and `emails` search params. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/users/page.tsx`
