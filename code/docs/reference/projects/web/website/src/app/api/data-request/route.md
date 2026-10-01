---
title: "Data request endpoint"
description: "Public POST endpoint that accepts a GDPR data-subject request."
status: stable
---

# Data request endpoint

> Guarded boundary in the route; validation, storage, and alert in the compliance package.

## Purpose

Accepts a public GDPR data-subject request. `withGuard` hardens the boundary (same-site origin, body cap, rate limit, optional Turnstile) and parses the body once; `submitDataRequest` validates, stores the request via the api (`data_requests`, D1), and alerts the controller. A honeypot-flagged submission returns `201` too. The route `404`s when `features.legal.dataRequest` is off. A `201` means the request was received.

## Exports

- `POST` — accepts a data-request payload, returns `201` on success or silent spam, `400` on invalid, `404` when disabled, `500` on error.

## Source

`code/projects/web/surfaces/website/src/app/api/data-request/route.ts`
