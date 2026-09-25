---
title: "Admin server actions"
description: "Server actions for admin role grants, session revocation, and settings writes — re-authorized and audited."
status: stable
---

# Admin server actions

> The admin dashboard's privileged mutations, re-authorized and audited server-side.

## Purpose

Holds the admin dashboard's privileged mutations. Because open passwordless sign-up means anyone can create an account, the role-grant path is the only thing between a stranger and admin. Every action re-checks the caller is a signed-in admin on the server (`requireAdmin`), validates the target id against a strict pattern, and writes an `audit` log. Revoking a role or a session also revokes the target's live Clerk sessions so a demotion or sign-out is immediate.

## Exports

- `grantAdmin` — grant the `admin` role to a Clerk user id.
- `revokeAdmin` — clear the role and revoke the user's active sessions.
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
