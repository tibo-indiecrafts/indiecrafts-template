---
title: "CSP report endpoint"
description: "Admin route handler that receives browser CSP violation reports and forwards them via the security-reports brick."
status: stable
---

# CSP report endpoint

> The admin endpoint browsers POST CSP violations to.

## Purpose

This route handler is the `report-to` / `report-uri` target for the admin surface's CSP. The browser POSTs violation reports here with no auth; the handler (from the security-reports brick) sanitizes each report and forwards it with the server-held token, tagged with the `admin` surface.

## Exports

- `POST` — the route handler; delegates to `handleCspReport` with `{ surface: "admin" }`.

## Source

`code/projects/web/surfaces/admin/src/app/api/csp-report/route.ts`
