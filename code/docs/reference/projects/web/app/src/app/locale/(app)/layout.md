---
title: "App group layout"
description: "Auth gate and sidebar shell for every route in the app group."
status: stable
---

# App group layout

> Sign-in gate plus the sidebar shell for the app group.

## Purpose

The layout for the `(app)` route group. Every route requires a signed-in user and renders inside the sidebar shell. It enforces auth server-side (defense-in-depth beyond the bypassable proxy — Next.js CVE-2025-29927). Auth is opt-in on the Clerk key: with a key set, no session redirects to sign-in; without a key the app runs as a public scaffold. `sign-in` lives outside this group.

A path that is not a locale (e.g. `/favicon.ico`, which the proxy matcher skips because of its dot) returns a 404 before `auth()` — calling `auth()` outside the proxy throws.

## Exports

- `default` — the `AppGroupLayout` component (takes `children` and `params`).

## Source

`code/projects/web/surfaces/app/src/app/[locale]/(app)/layout.tsx`
