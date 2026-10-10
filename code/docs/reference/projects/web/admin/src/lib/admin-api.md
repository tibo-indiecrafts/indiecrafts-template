---
title: "Admin api plumbing"
description: "Who the acting admin is, and a bearer POST to the shared api."
status: stable
---

# Admin api plumbing

> The two helpers every admin server action uses.

## Purpose

`adminId()` returns the caller's user id when they are a signed-in admin (checked on the server from the Clerk session, never trusted from the client), else null. `postApi(path, body?)` POSTs a bearer-gated api route with `APP_API_TOKEN` (60 s timeout: a cron tick or an erasure retry can be long) and returns `{ status, data }`, or null when the api is not configured or unreachable. Server-only, kept out of the `"use server"` files so neither is callable from the browser.

## Exports

- `adminId()` → `string | null`.
- `postApi(path, body?)` → `{ status, data } | null`.

## Source

`code/projects/web/surfaces/admin/src/lib/admin-api.ts`
