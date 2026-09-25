---
title: "Clerk user.deleted handler"
description: "Runs the full erasure engine when Clerk deletes a user out-of-band, excluding the Clerk adapter."
status: stable
---

# Clerk user.deleted handler

> Turns an out-of-band Clerk deletion into a complete erasure run.

## Purpose

Handles the Clerk `user.deleted` webhook. It reads the stored email and fingerprint before the engine pseudonymizes the profile, then runs the full erasure engine with the `clerk` adapter excluded (the user is already gone in Clerk). It branches on a `churn_events` row: present means self-service churn, so it suppresses the Resend contact (win-back cohort); absent means an admin/RTBF delete, so it pure-deletes the contact. Everything is best-effort and never throws. No completion email is sent — the subject is deleted.

## Exports

- `handleClerkUserDeleted(env, userId, ts, buildAdapters?, del?, suppress?, fetchPrefs?)` — runs the erasure, mirrors the Resend op, and writes the `erasure_requests` + `admin_audit` bookkeeping rows. The last four params are injectable for tests.

## Usage

```ts
import { handleClerkUserDeleted } from "@indiecrafts/api/erasure/clerk-deleted";

// from the /v1/clerk-webhook dispatch on evt.type === "user.deleted"
await handleClerkUserDeleted(env, userId, new Date().toISOString());
```

## Source

`code/shared/api/src/erasure/clerk-deleted.ts`
