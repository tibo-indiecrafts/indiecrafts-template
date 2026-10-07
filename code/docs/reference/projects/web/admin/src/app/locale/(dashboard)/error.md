---
title: "Dashboard error boundary"
description: "The localized error state for a failed dashboard page, shown inside the admin shell."
status: stable
---

# Dashboard error boundary

> A failed dashboard page shows a short message and a Retry button. The sidebar stays usable.

## Purpose

Client error boundary for the `(dashboard)` group. It sits under the group layout, so it renders inside `AppShell`'s `<main id="main">`: the operator keeps the sidebar and can open another page. It uses the admin page treatment (`PageHeader` + `Button`) and copy from `admin.error` in `messages/<locale>.json`. It never shows the raw error message. Retry calls `reset`. It logs nothing itself: Next logs a server error with its digest in the Worker logs, and React reports a caught client error to the browser console.

An error in the group layout itself (the admin gate) or on `/sign-in` is outside this boundary.

## Exports

- default export `DashboardError({ error, reset })`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/error.tsx`
