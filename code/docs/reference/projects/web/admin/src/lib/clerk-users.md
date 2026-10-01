---
title: "Clerk user emails"
description: "Resolves Clerk user ids to emails for operator screens that store only the id."
status: stable
---

# Clerk user emails

> Server-only id → email lookup, fetched live from Clerk and never stored.

## Purpose

The sign-in feed in D1 stores only the Clerk user id (GDPR data minimization). The Sessions screen still needs to show who a row belongs to, so the page resolves the ids to emails at request time with one Clerk call. On any Clerk error it returns `{}`, and the screen shows the bare id.

## Exports

- `primaryEmail(user)` — the user's primary email, else their first one, else `null`. The Users screen uses it too.
- `fetchEmails(userIds)` — `{ [userId]: email }` for up to 100 distinct ids.

## Usage

```ts
import { fetchEmails } from "@/lib/clerk-users";

const emails = await fetchEmails(rows.map((r) => r.user_id));
```

## Source

`code/projects/web/surfaces/admin/src/lib/clerk-users.ts`
