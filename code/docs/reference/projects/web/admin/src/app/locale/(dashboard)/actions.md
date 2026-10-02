---
title: "Admin server actions"
description: "Server actions for admin role grants, session revocation, and settings writes — re-authorized and audited."
status: stable
---

# Admin server actions

> The admin dashboard's privileged mutations, re-authorized and audited server-side.

## Purpose

Holds the admin dashboard's privileged mutations. Because open passwordless sign-up means anyone can create an account, the role-grant path is the only thing between a stranger and admin. Every action re-checks the caller is a signed-in admin on the server (`requireAdmin`), validates the target id against a strict pattern, and writes an `audit` log. Demotion is not a dashboard action: an operator removes the role in the Clerk Dashboard (Users → user → Public metadata).

A session revocation reads up to 500 active sessions (Clerk's default page is 10), tries every one, and returns `failed` if one revoke failed. It audits any real sign-out, even a partial one, and writes no row when nothing was revoked.

Each action returns `{ ok: true }` or `{ ok: false, error }`, where `error` is `forbidden` (not an admin), `invalid_user` or `invalid_session` (a malformed id), or `failed` (Clerk or the api failed).

## Exports

- `grantAdmin` — grant the `admin` role to a Clerk user id.
- `listUserSessions` — read a user's active Clerk sessions, sanitized for the admin view; returns `[]` on failure.
- `revokeSession` — revoke one live session (immediate sign-out on that device).
- `revokeUserSessions` — revoke all of a user's active sessions ("sign out everywhere").
- `saveSetting` — forward one operational setting write to the shared api, which validates the bound.
- `LiveSession` — the sanitized session shape returned by `listUserSessions`.

## Usage

```tsx
import { grantAdmin } from "./actions";

const result = await grantAdmin(userId.trim());
```

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/actions.ts`
