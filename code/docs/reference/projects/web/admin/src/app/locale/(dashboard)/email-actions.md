---
title: "Email override actions"
description: "Server actions: turn a person's emails off, or change an account's sign-in email."
status: stable
---

# Email override actions

> The admin's two email actions — re-authorized on the server, validated, audited by the api.

## Purpose

- `turnOffEmails({ userId | email, off, stopAll, reason })` — off only. Validates the subject, the category keys and the reason code, then calls `POST /v1/admin/email-preferences` with the acting admin (the api checks that admin's role too).
- `changeSignInEmail({ userId, email, confirm, reason })` — a **login path**, so: admin-only, the new address typed twice, a reason code, never an admin's account (an operator does that in the Clerk Dashboard). In order, each step only after the last: (1) add the new address, verified and primary — the change is now real, so `admin.change_email` is audited at once with the reason, whatever follows; (2) revoke every session, checking each one went; (3) remove the old address. A session left open or an old address Clerk keeps answers `partial`, and the operator finishes in the Clerk Dashboard. Only a complete change moves the Resend contact (`POST /v1/admin/email-preferences/move`). Clerk notifies the person.

## Exports

- `turnOffEmails(input)` → `OverrideResult`.
- `changeSignInEmail(input)` → `ChangeEmailResult`.
- `OverrideResult` · `ChangeEmailResult`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/email-actions.ts`
