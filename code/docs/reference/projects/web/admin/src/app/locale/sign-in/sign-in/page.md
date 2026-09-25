---
title: "Admin sign-in page"
description: "The one public admin route: renders Clerk's hosted sign-in with non-admin and unconfigured fallbacks."
status: stable
---

# Admin sign-in page

> The single public admin route, rendering Clerk's hosted sign-in.

## Purpose

This is the admin surface's only public route; the proxy redirects every other route here until an admin session exists. It renders Clerk's hosted sign-in view (sign-in only, no open sign-up). When Clerk is not configured it shows a note instead of the throwing widget, and when a signed-in non-admin lands here it shows `NotAdminNotice` with a sign-out path rather than a blank screen.

## Exports

- `default` — `SignInPage`, an async server component for the admin sign-in route. Not imported by other code; Next.js renders it for the segment.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/sign-in/[[...sign-in]]/page.tsx`
