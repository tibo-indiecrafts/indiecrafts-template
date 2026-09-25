---
title: "Waitlist join engine"
description: "Server-only path that validates, dedupes, and stores a waitlist signup, then fires best-effort confirmation and owner-alert emails."
status: stable
---

# Waitlist join engine

> The single runtime write path for the `module.waitlist` block.

## Purpose

Validates a waitlist submission, dedupes it by email, and always stores a `waitlistEntry` document via the server-only write client. On a new entry it may fire two best-effort emails: a confirmation to the joiner and an alert to the owner. Neither email can fail the signup. This is a collect-and-export feature with no runtime gating.

## Exports

- `JoinInput` — the submission shape: `email`, optional `name`, `consent`, `source`, `language`, plus the honeypot and `startedAt` anti-spam fields.
- `JoinResult` — a discriminated union: `{ ok: true, already? }` or `{ ok: false, error }`.
- `validateJoin(input)` — pure validator; runs the shared spam, email, and consent checks.
- `join(input, createdAt, policyVersion?)` — the full write path: validate, dedupe, create the entry, then send the two best-effort emails.

## Usage

```ts
import { join } from "@indiecrafts/modules-web-waitlist/lib/waitlist";

const result = await join(
  { email: "a@b.com", consent: true, source: "/launch", language: "fr" },
  new Date().toISOString(),
  "2025-01-01",
);
if (!result.ok) console.error(result.error);
```

## Source

`code/modules/web/waitlist/src/lib/waitlist.ts`
