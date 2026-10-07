---
title: "Clerk load decision"
description: "Server-side rule for when the website mounts Clerk: a signed-in visitor or the sign-in / sign-up pages."
status: stable
---

# Clerk load decision

> Load Clerk only for the visitors who need it.

## Purpose

Clerk's React bundle and its CDN scripts cost about 135 kB of JS plus ~300 KiB on every page that mounts it. `shouldLoadClerk(pathname)` returns true for a signed-in visitor (`auth()`, verified by `clerkMiddleware`) and for the sign-in / sign-up pages, and false otherwise, or always when no Clerk key is set. The locale layout calls it with the proxy's `x-pathname` header and mounts the `LazyClerk` pieces only when it is true.

## Exports

- `isClerkRoute(pathname)` — true for `/sign-in` and `/sign-up` (and their sub-paths), with or without a locale prefix.
- `shouldLoadClerk(pathname)` — the decision; `pathname` may be null.

## Source

`code/projects/web/surfaces/website/src/lib/clerk-load.ts`
