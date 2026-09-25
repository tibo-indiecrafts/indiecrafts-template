---
title: "Draft mode disable endpoint"
description: "Exits Sanity draft preview and redirects the visitor to the home page."
status: stable
---

# Draft mode disable endpoint

> Ends the preview session and sends the visitor home.

## Purpose

Exits Sanity draft preview. It disables Next.js draft mode and redirects the visitor to the home page. The route is gated by `features.studio` for parity with the enable endpoint, returning `404` when the Studio feature is off.

## Exports

- `GET` — disables draft mode and redirects to `/`, or returns `404` when the Studio is disabled.

## Source

`code/projects/web/surfaces/website/src/app/api/draft-mode/disable/route.ts`
