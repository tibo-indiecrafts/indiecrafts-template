---
title: "Brand provider"
description: "Hands the server-read brand to client screens such as the error boundary."
status: stable
---

# Brand provider

> Hands the server-read brand to client screens such as the error boundary.

## Purpose

The `[locale]` layout reads the brand on the server (`getBrand`) and provides it here, so the client error boundary shows the logo without fetching — it must render even when Sanity is down.

## Exports

- `BrandProvider({ brand, children })`.
- `useBrand()` → `Brand | null`.

## Source

`code/projects/web/surfaces/app/src/user-interface/BrandProvider.tsx`
