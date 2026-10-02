---
title: "Sessions table"
description: "Client component that renders the sign-in feed and lets an operator manage a user's live Clerk sessions."
status: stable
---

# Sessions table

> The sign-in feed with per-user live session management.

## Purpose

A client component used by the admin sessions page. It renders each recorded sign-in row and lets an operator expand a row to load that user's active Clerk sessions and revoke one — or all of them. The live-session reads and revokes run through server actions in `actions.ts`. Each revoke result shows as a toast, so "sign out everywhere" gives feedback with the row collapsed. Times use the next-intl formatter: the admin locale, in UTC.

## Exports

- `SessionRow` — the feed row type: `ts`, `surface`, `user_id`, `session_id`, `country`.
- `SessionsTable` — client component; takes `rows: SessionRow[]` and an optional `emails` map (user id → email, from `fetchEmails` in `src/lib/clerk-users.ts`). The email has its own column next to the Clerk id, with a dash when Clerk returns none.

## Usage

```tsx
import { SessionsTable, type SessionRow } from "../sessions-table";

const rows: SessionRow[] = await fetchSessions();
return <SessionsTable rows={rows} />;
```

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/sessions-table.tsx`
