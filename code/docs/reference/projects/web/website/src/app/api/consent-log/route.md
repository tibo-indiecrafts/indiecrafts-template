---
title: "Consent log endpoint"
description: "Same-origin endpoint that records a visitor's consent decision."
status: stable
---

# Consent log endpoint

> The client POSTs consent events with no userId; the server resolves identity.

## Purpose

Records a consent decision for the current visitor. The client (`reportConsent`) POSTs consent events with no `userId`; the route resolves identity server-side from Clerk `auth()` (the trust boundary). It caps the body before parsing, requires `events`, `version`, and `decisionId`, and stores the country from the `cf-ipcountry` header. Anonymous visitors are logged only when `features.compliance.logAnonymousConsent` is on, keyed by a first-party `consent_id` cookie.

## Exports

- `POST` — logs consent events, returns `204` on success or skip, `400` on a malformed body, `413` when the body is too large.

## Source

`code/projects/web/surfaces/website/src/app/api/consent-log/route.ts`
