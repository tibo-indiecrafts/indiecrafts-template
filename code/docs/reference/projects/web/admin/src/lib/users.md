---
title: "Users reader"
description: "Read the admin users list from Clerk and each user's marketing-email opt-in from the api."
status: stable
---

# Users reader

> The Users page's data, kept out of the page component.

## Purpose

`fetchUsers(query)` lists up to 50 Clerk users (newest first, optional search). `fetchMarketingConsent(userIds)` reads each user's marketing opt-in from `POST /v1/profiles/consent`; it fails open (every id → "not asked") so the list never breaks. Server-only.

## Exports

- `fetchUsers(query)` → `UserRow[]`.
- `fetchMarketingConsent(userIds)` → `{ [userId]: 0 | 1 | null }`.
- `UserRow`.

## Source

`code/projects/web/surfaces/admin/src/lib/users.ts`
