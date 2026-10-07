---
title: "Clerk active"
description: "Context that tells client components whether Clerk is mounted above them."
status: stable
---

# Clerk active

> Choose Clerk UI or a Clerk-free fallback without importing Clerk.

## Purpose

Clerk's hooks throw without `ClerkProvider`. A surface that loads Clerk only when needed (the website) needs to know, in a client component, whether the provider is there. `AppClerkProvider` wraps its children in `ClerkActive`, so `useClerkActive()` is true under it and false elsewhere. The module imports nothing from Clerk, so reading it costs no bundle.

## Exports

- `ClerkActive({ children })` — marks its subtree; `AppClerkProvider` renders it.
- `useClerkActive()` — `true` under `AppClerkProvider` (with a key), else `false`.

## Source

`code/packages/web/auth/src/clerk-active.tsx`
