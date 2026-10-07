---
title: "Dashboard loading state"
description: "The loading state shown inside the shell while a (dashboard) page streams in."
status: stable
---

# Dashboard loading state

> A spinner and a status message while a `(dashboard)` page loads. The shell stays on screen.

## Purpose

Next wraps each `(dashboard)` page in a Suspense boundary with this fallback. It sits under the group layout, so the sidebar and header stay while the page streams in. A `role="status"` region holds a visually hidden label (`admin.loading` in `messages/<locale>.json`); the `Spinner` is `aria-hidden`.

## Exports

- default export `DashboardLoading()`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/loading.tsx`
