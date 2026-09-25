---
title: "Session log endpoint"
description: "Admin route handler that logs a signed-in caller's sign-in to the audit api server-side."
status: stable
---

# Session log endpoint

> The admin endpoint that records a sign-in to the audit api.

## Purpose

This route handler is the same-origin sign-in logger. The browser's `SessionLogger` POSTs here with no secret; the handler requires a signed-in Clerk caller (401 otherwise), then forwards to the audit api server-side (holding `APP_API_TOKEN`) with the surface and the user's country. It returns 204 on success.

## Exports

- `POST` — the route handler; authenticates the caller and calls `logSession`.

## Source

`code/projects/web/surfaces/admin/src/app/api/session-log/route.ts`
