---
title: "CSP report endpoint"
description: "The POST endpoint that receives browser Content-Security-Policy violation reports for the app surface."
status: stable
---

# CSP report endpoint

> Receives CSP violation reports and forwards them server-side.

## Purpose

The browser POSTs CSP violations here via `report-to` / `report-uri`. The route has no auth: it delegates to the shared `handleCspReport` handler, which sanitizes each report and forwards it with the server-held token, tagged with `surface: "app"`.

## Exports

- `POST` — the request handler.

## Source

`code/projects/web/surfaces/app/src/app/api/csp-report/route.ts`
