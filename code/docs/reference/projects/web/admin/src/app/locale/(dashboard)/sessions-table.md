---
title: "Sessions table"
description: "Client component that renders the sign-in feed and lets an operator manage a user's live Clerk sessions."
status: stable
---

# Sessions table

> The sign-in feed with per-user live session management.

## Purpose

A client component used by the admin sessions page. It renders each recorded sign-in row and lets an operator expand a row to load that user's active Clerk sessions and revoke one — or all of them. The live-session reads and revokes run through server actions in `actions.ts`.

## Exports

- `SessionRow` — the feed row type: `ts`, `surface`, `user_id`, `session_id`, `country`.
- `SessionsTable` — client component; takes `rows: SessionRow[]` and renders the managed table.

## Usage

```tsx
import { SessionsTable, type SessionRow } from "../sessions-table";

const rows: SessionRow[] = await fetchSessions();
return <SessionsTable rows={rows} />;
```

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/sessions-table.tsx`
