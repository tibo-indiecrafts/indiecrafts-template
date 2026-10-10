---
title: "Email-preference store"
description: "D1 read/write layer for per-category marketing opt-ins with append-only consent proof."
status: stable
---

# Email-preference store

> Per-category opt-in state, its consent proof, and the derived marketing_email cache.

## Purpose

Pure read/write layer for per-category marketing opt-ins. State lives in `email_preferences` (one row per user per category). Each write also appends an append-only `consent_events` proof row and recomputes the derived `user_profiles.marketing_email` cache used by the Resend sync and the legacy single-flag readers. Writes are batched so each preference row and its proof row commit together.

## Exports

- `readPreferences(db, userId)` — returns `{ [category_key]: granted }` for a user.
- `recomputeMarketingEmail(db, userId, marketingKeys)` — sets `marketing_email` to 1 if any marketing key is granted.
- `writePreferences(db, opts)` — upserts each preference, appends its proof row, then recomputes the cache. `opts.source` is `account` (the person, default) or `admin` (an admin override on the person's request); it is stored on the proof row.

## Usage

```ts
import {
  readPreferences,
  writePreferences,
} from "./consent/email-preferences-store";

const stored = await readPreferences(db, userId);
await writePreferences(db, {
  userId,
  fingerprint,
  updates: [{ key: "news", granted: true }],
  surface: "account",
  country,
  marketingKeys: ["news"],
});
```

## Source

`code/shared/api/src/consent/email-preferences-store.ts`
