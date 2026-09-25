---
title: "Session log endpoint"
description: "Same-origin endpoint that records a signed-in user's sign-in session."
status: stable
---

# Session log endpoint

> The client POSTs with no secret; the server forwards to the audit API with its token.

## Purpose

Records a sign-in session for auditing. The browser (`SessionLogger`) POSTs here with no secret; the route forwards to the audit API server-side (holding `APP_API_TOKEN`) with the app's surface and the user's country. Only a signed-in caller is accepted — an unauthenticated request gets `401`.

## Exports

- `POST` — logs the session for the authenticated user, returns `204`, or `401` when not signed in.

## Source

`code/projects/web/surfaces/website/src/app/api/session-log/route.ts`
