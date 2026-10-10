---
title: "Clerk sessions helper"
description: "Revoke every active Clerk session of a user."
status: stable
---

# Clerk sessions helper

> Shared by the session actions and the sign-in email change.

## Purpose

Lists the user's active sessions (one page of up to `SESSION_LIMIT`) and revokes each, trying them all even when one fails, and returns how many were revoked. Server-only, kept out of the `"use server"` action files so it is never callable from the browser.

## Exports

- `revokeActiveSessions(client, userId)` → `{ revoked, total }`.
- `SESSION_LIMIT` — 500, Clerk's maximum page.

## Source

`code/projects/web/surfaces/admin/src/lib/clerk-sessions.ts`
