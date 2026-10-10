---
title: "Email preferences reader (admin)"
description: "Fetch one person's email preferences from the shared api."
status: stable
---

# Email preferences reader (admin)

> The admin's read of `GET /v1/admin/email-preferences`.

## Purpose

Reads an account (`userId`) or an address (`email`) with the server bearer, naming the acting admin so the api can audit the view. Returns `null` on a bad id or address, an unconfigured api or an api error — never a false "no preferences". Server-only.

## Exports

- `fetchEmailPreferences(subject, actor)` → `EmailPrefState | null`.
- `EmailPrefState` · `EmailPrefCategory`.

## Source

`code/projects/web/surfaces/admin/src/lib/email-preferences.ts`
