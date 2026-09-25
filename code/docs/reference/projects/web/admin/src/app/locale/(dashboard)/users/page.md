---
title: "Users page"
description: "Admin route that browses and searches Clerk users and shows each user's marketing-email consent."
status: stable
---

# Users page

> The admin screen for browsing Clerk users and their email consent.

## Purpose

This is the `/users` segment of the admin dashboard. It lists and searches Clerk users server-side (the admin app holds the Clerk secret), read-only, ordered newest first. For the listed user ids it also fetches the marketing-email opt-in from the shared api; that fetch fails open, so a consent error never breaks the list.

## Exports

- `default` — `UsersPage`, an async server component for the admin `/users` route. It reads the `q` search param. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/users/page.tsx`
