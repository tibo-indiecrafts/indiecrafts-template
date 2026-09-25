---
title: "Churn store"
description: "Read/write layer for churn_events — the departed-user exit survey and its aggregates."
status: stable
---

# Churn store

> The D1 store behind the exit survey and the admin churn dashboard.

## Purpose

Pure read/write layer for `churn_events` (the `main` D1 table). It stores one row per departed user from the self-service delete's exit survey — reason, feedback, and competitor, with no email or name. The webhook reads a row to branch suppress-vs-delete of the Resend contact; the admin dashboard reads the aggregate. Client values are never trusted: the reason is normalized against a preset list and free text is clipped.

## Exports

- `CHURN_REASONS` / `ChurnReason` — the preset reason codes and their union type.
- `ChurnSurvey` — the survey shape: optional `reason`, `feedback`, `competitor`.
- `normalizeReason(value)` — returns the value only if it is a known preset code, else `null`.
- `writeChurnEvent(db, userId, survey, ts)` — inserts or replaces the user's churn row.
- `readChurnEvent(db, userId)` — returns `{ reason }` for the suppress-vs-delete branch, or `null`.
- `ChurnAggregate` — the dashboard shape: `total`, `byDay`, `byReason`, `recentFeedback`.
- `readChurnAggregate(db)` — computes the aggregate with pure grouped counts.

## Usage

```ts
import { writeChurnEvent, readChurnAggregate } from "./consent/churn-store";

await writeChurnEvent(db, userId, { reason: "too_expensive" }, ts);
const stats = await readChurnAggregate(db);
```

## Source

`code/shared/api/src/consent/churn-store.ts`
