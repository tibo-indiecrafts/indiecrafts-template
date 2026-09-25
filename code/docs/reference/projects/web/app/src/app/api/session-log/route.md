---
title: "Session log endpoint"
description: "The same-origin POST endpoint that logs a signed-in session to the audit api."
status: stable
---

# Session log endpoint

> Logs a signed-in session and forwards it to the audit api.

## Purpose

Same-origin sign-in logger. The browser (`SessionLogger`) POSTs here with no secret; the route reads the Clerk session, rejects anonymous callers with `401`, then forwards the surface, user id, session id, and country to the audit api server-side via `logSession` (holding `APP_API_TOKEN`). Returns `204` on success.

## Exports

- `POST` — the request handler.

## Source

`code/projects/web/surfaces/app/src/app/api/session-log/route.ts`
