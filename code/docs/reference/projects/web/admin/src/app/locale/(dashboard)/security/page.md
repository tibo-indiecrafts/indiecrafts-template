---
title: "Security incidents page"
description: "Admin route that lists recent app-level security incidents from the shared api and links to the edge firehose."
status: stable
---

# Security incidents page

> The admin screen for recent app-level security events.

## Purpose

This is the `/security` segment of the admin dashboard. It reads recent app-level incidents from the shared api server-side (the api holds the token), with a data-minimized projection (no `ip_hash`). A failed read is distinguished from a healthy-but-empty feed, so a broken monitor never reads as "all clear". Rows come newest first. The event type and severity show as labels in the admin's locale (`admin.security.types` / `severities`); a code outside the taxonomy shows as is. It also deep-links to the Cloudflare edge security view when `CLOUDFLARE_SECURITY_URL` is set.

## Exports

- `generateMetadata` — the page title (`admin.security.title`).
- `default` — `SecurityPage`, an async server component for the admin `/security` route. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/security/page.tsx`
