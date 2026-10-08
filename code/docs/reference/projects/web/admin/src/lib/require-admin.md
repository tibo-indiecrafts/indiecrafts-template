---
title: "Admin page gate"
description: "The shared server-side admin check for dashboard routes, failing closed to sign-in."
status: stable
---

# Admin page gate

> `requireAdminPage(locale)` — anyone but a signed-in admin is redirected to `/sign-in`.

## Purpose

The one admin check for a dashboard route. The `(dashboard)` layout calls it, and every
dashboard page calls it before it reads data. A layout check alone does not guard a page:
on a client navigation Next skips a layout the client already has (partial rendering), so
a page can render without its layout. The proxy is coarse routing only, and middleware is
bypassable (Next.js CVE-2025-29927).

The check fails closed. With no `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` it redirects before it
asks Clerk, so a deploy without Clerk is locked, not exposed. With Clerk, a session without
the `admin` role claim (`isAdmin` from `@indiecrafts/packages-shared-auth`) redirects.
Server actions keep their own `requireAdmin` in `(dashboard)/actions.ts`.

## Exports

- `requireAdminPage(locale)` — resolves for an admin; otherwise calls the next-intl
  `redirect` (which throws) to `/sign-in` in `locale`.

## Source

`code/projects/web/surfaces/admin/src/lib/require-admin.ts`
