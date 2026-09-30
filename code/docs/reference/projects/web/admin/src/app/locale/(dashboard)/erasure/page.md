---
title: "Erasure requests page"
description: "Admin route that shows open GDPR erasure requests by deadline from GET /v1/erasure-requests."
status: stable
---

# Erasure requests page

> The admin dashboard's erasure-deadline monitoring route.

## Purpose

Reads `GET /v1/erasure-requests` server-side and renders it through `ErasureTable`. Display only — the erasure engine acts on requests; this page lets the operator verify the one-month deadline (GDPR Art. 12(3)).

## Exports

- `default` — `ErasurePage`, the route segment component for `/[locale]/erasure`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/erasure/page.tsx`
