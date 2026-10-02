---
title: "App consent log route"
description: "Same-origin endpoint that forwards a signed-in user's cookie-consent decision to the audit api."
status: stable
---

# App consent log route

> `POST /api/consent-log` on the app — the proof of a signed-in user's cookie choice.

## Purpose

The app's banner (`ConsentGate`) and its account Privacy tab call `reportConsent`, which POSTs the decision here with no user id. The route resolves the user from Clerk `auth()` server-side (the trust boundary) and forwards the decision through `logConsent` to the api's `consent_events` (surface `app`, the edge country, the visitor IP for the api's rate limit). Account-scoped only: the app has no anonymous-logging flag, so a signed-out call returns `204` and writes nothing. The body is capped at 4,000 bytes (`413`); a body without `events`, `version` or `decisionId` is a `400`. The proxy matcher lists the route so `auth()` has the session.

## Exports

- `POST(request)` — the handler.

## Source

`code/projects/web/surfaces/app/src/app/api/consent-log/route.ts`
