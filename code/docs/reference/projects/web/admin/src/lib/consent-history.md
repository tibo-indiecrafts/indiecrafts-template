---
title: "Consent history fetch"
description: "Server-only fetch of one user's consent history from the shared api, recording the admin view in the audit trail."
status: stable
---

# Consent history fetch

> Read a user's consent decisions — and record that an admin looked.

## Purpose

Calls the api's `GET /v1/consent/history` with the server-held `APP_API_TOKEN`. Viewing a person's consent history is itself an access to personal data, so a successful read writes `admin.view_consent` (actor → target) through `audit()` to `admin_audit`. Returns `null` when the history could not be loaded (a malformed id, an unconfigured env, an api error) — the sheet then shows an error, never a false "no decisions".

## Exports

- `ConsentDecision`, `ConsentHistory` — the api's response shape.
- `fetchConsentHistory(userId, actor)` — `ConsentHistory | null`.

## Source

`code/projects/web/surfaces/admin/src/lib/consent-history.ts`
