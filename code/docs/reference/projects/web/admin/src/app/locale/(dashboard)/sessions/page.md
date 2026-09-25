---
title: "Sessions page"
description: "Admin route that reads recent sign-ins from the shared api and renders them with live session management."
status: stable
---

# Sessions page

> The admin screen for recent sign-in activity.

## Purpose

This is the `/sessions` segment of the admin dashboard. It fetches recent sign-ins from the shared api server-side (the api holds the token, and the projection carries no IP), then renders them through `SessionsTable` for per-user live Clerk session management.

## Exports

- `default` — `SessionsPage`, an async server component for the admin `/sessions` route. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/sessions/page.tsx`
