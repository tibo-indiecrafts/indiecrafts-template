---
title: "Override reasons"
description: "The reason codes for an admin email override."
status: stable
---

# Override reasons

> One list, shared by the panel, the form, the actions and the api contract.

## Purpose

An admin must say why they turned email off or changed a sign-in email: by email, by phone, a complaint, a bouncing address, or other. The codes are fixed so the audit trail — kept through an erasure — holds no personal data. Not server-only: the client panel renders the list.

## Exports

- `OVERRIDE_REASONS` — the codes.
- `OverrideReason` — their union.

## Source

`code/projects/web/surfaces/admin/src/lib/override-reasons.ts`
