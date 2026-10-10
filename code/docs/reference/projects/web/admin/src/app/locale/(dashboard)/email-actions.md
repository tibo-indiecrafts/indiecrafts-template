---
title: "Email override actions"
description: "Server actions: turn a person's emails off, or change an account's sign-in email."
status: stable
---

# Email override actions

> The admin's two email actions — re-authorized on the server, validated, audited by the api.

## Purpose

- `turnOffEmails({ userId | email, off, stopAll, reason })` — off only. Validates the subject, the category keys and the reason code, then calls `POST /v1/admin/email-preferences` with the acting admin.
- `changeSignInEmail({ userId, email, confirm, reason })` — a **login path**, so: admin-only, the new address typed twice, a reason code, and never an admin's account (an operator does that in the Clerk Dashboard). It adds the new address verified and primary, removes the old one, and revokes every session, so whoever held the old address is signed out. Clerk notifies the person. Then `POST /v1/admin/email-preferences/move` moves the Resend contact and audits; if the api is down, the Clerk change stands and `audit()` keeps a trace.

## Exports

- `turnOffEmails(input)` → `OverrideResult`.
- `changeSignInEmail(input)` → `ChangeEmailResult`.
- `OverrideResult` · `ChangeEmailResult`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/email-actions.ts`
