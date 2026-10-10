---
title: "Email-override contract"
description: "The admin email-override reason codes and the visitor consent a category withdraws."
status: stable
---

# Email-override contract

> One contract for the admin app and the api: why an admin acted, and which consent a withdrawal closes.

## Purpose

An admin who turns a person's email off, or changes their sign-in email, gives a reason from a fixed list — by email, by phone, a complaint, a bouncing address, other. The codes are fixed so `admin_audit`, which outlives an erasure, holds no personal data; the api refuses anything else. `VISITOR_CONSENT_TYPE` maps a category to the visitor consent it came from (`news` → `newsletter`, `general` → `waitlist`): turning the category off also writes a `granted = 0` row of that type, so the consent ledger agrees with the person's state. Pure TypeScript — the admin UI, the admin actions and the api Worker import it.

## Exports

- `OVERRIDE_REASONS` · `OverrideReason` — the reason codes.
- `isOverrideReason(value)` — the guard both sides use.
- `VISITOR_CONSENT_TYPE` — category key → visitor consent type.

## Source

`code/packages/shared/compliance/src/shared/email-overrides.ts`
