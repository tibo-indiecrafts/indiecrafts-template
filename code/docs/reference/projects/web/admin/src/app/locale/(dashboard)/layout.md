---
title: "Dashboard admin gate"
description: "Layout for the admin dashboard route group that enforces an admin session and fails closed."
status: stable
---

# Dashboard admin gate

> The data-layer auth gate wrapping every admin dashboard route.

## Purpose

This layout wraps the `(dashboard)` route group. It is defense-in-depth beyond the middleware: it reads the Clerk session and redirects non-admins to `/sign-in`. It fails closed — when Clerk has no publishable key, it redirects rather than rendering admin open, so a misconfigured deploy is locked, not exposed. Admin children render inside `AppShell`.

## Exports

- `default` — `DashboardLayout`, an async server component. Not imported by other code; Next.js applies it to the route group.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/layout.tsx`
