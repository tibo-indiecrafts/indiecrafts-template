---
title: "CSP violations dashboard"
description: "Admin route that lists aggregated Content-Security-Policy violation groups read from the shared api."
status: stable
---

# CSP violations dashboard

> The admin screen that shows grouped CSP violation reports.

## Purpose

This is the `/csp` segment of the admin dashboard route group. It reads aggregated CSP violation groups from the shared api server-side (the api holds the token), then renders them in a shadcn `Table`. It distinguishes a failed read from a healthy-but-empty feed, so a broken read never appears as "no violations".

## Exports

- `default` — `CspPage`, an async server component for the admin `/csp` route. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/csp/page.tsx`
