---
title: "CSP report endpoint"
description: "Receives browser Content-Security-Policy violation reports for the website surface."
status: stable
---

# CSP report endpoint

> The browser POSTs CSP violations here; the handler sanitizes and forwards them.

## Purpose

Receives Content-Security-Policy violation reports the browser sends via `report-to` / `report-uri`. There is no auth: the shared `handleCspReport` handler sanitizes each report and forwards it with the server-held token, tagged with the `website` surface. The logic lives in the security-reports brick.

## Exports

- `POST` — delegates to `handleCspReport` for the `website` surface.

## Source

`code/projects/web/surfaces/website/src/app/api/csp-report/route.ts`
