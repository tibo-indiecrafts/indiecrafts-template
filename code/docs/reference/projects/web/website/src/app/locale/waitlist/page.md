---
title: "Waitlist landing route"
description: "Server route that renders the gated waitlist landing page for a locale."
status: stable
---

# Waitlist landing route

> A thin route shell: gate, chrome, and SEO here; the view lives in the waitlist module.

## Purpose

Renders the `/waitlist` landing page. The route resolves the locale, sets the request locale, and returns the `WaitlistLanding` view inside `DefaultLayout`. It is double-gated: it `notFound()`s when `features.waitlist` is off and again when the Sanity `waitlistSettings.enabled` toggle is `false`.

## Exports

- `generateMetadata` — builds locale-aware metadata from `pages.waitlist`.
- `default` (`WaitlistPage`) — async server component for the waitlist route.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/waitlist/page.tsx`
