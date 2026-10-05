---
title: "Consent history read"
description: "Reads one user's consent decisions for the admin: the latest per type and the timeline, data-minimized."
status: stable
---

# Consent history read

> The read behind `GET /v1/consent/history` — the admin's per-user consent panel.

## Purpose

Reads the append-only `consent_events` proof log (MAIN_DB) for one Clerk user. `current` is the latest decision per consent type (analytics/marketing cookies, commercial email, each `email_pref:<key>` category, legal re-acceptance), sorted by type. `events` is the last 100 decisions, newest first. The projection is data-minimized: never `ip_hash` or `email_fingerprint`. The route is admin-bearer-gated and rate-limited, and returns `400` for an id that is not a Clerk user id.

## Exports

- `USER_ID` — the Clerk user-id pattern the route validates.
- `ConsentDecision` — `{ ts, type, granted, policyVersion, surface, source, country }`.
- `readConsentHistory(db, userId, limit?)` — `{ current, events }`.

## Source

`code/shared/api/src/consent/history.ts`
