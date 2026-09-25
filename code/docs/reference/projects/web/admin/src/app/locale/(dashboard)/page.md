---
title: "Admin dashboard home"
description: "Admin landing route that shows a card per nav section with a best-effort row count and the role form."
status: stable
---

# Admin dashboard home

> The admin landing page with per-section counts and the role editor.

## Purpose

This is the index route of the admin dashboard. It renders one linked `Card` per nav item (from `NAV`, minus the overview key). For a few sections it fetches a cheap row count from the shared api's list endpoints; sections without a plain list render "—". It also mounts `AdminRoleForm` for granting the admin role.

## Exports

- `default` — `AdminHome`, an async server component for the admin index route. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/page.tsx`
