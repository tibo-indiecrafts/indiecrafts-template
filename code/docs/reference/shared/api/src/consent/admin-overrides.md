---
title: "Admin email overrides (api)"
description: "Read a person's email preferences and turn them off on request — never on."
status: stable
---

# Admin email overrides (api)

> The api half of the admin email panel: read, turn off, stop all, move a contact.

## Purpose

The admin app calls these bearer-gated routes; its server actions re-check the admin role.

- `GET /v1/admin/email-preferences?userId=` or `?email=`, with `&actorUserId=` — every category with the account's own choice (`granted`, the same state its preference centre shows; `null` for a person without an account) and the Resend topic state, plus the contact's global state (`resend: null` when Resend could not be read). An email that belongs to an account resolves to the account. The view is audited as `admin.view_email_prefs`.
- `POST /v1/admin/email-preferences` — `{ userId | email, off: string[], stopAll?, reason, actorUserId }`. Turns the listed categories off; `stopAll` turns every category off and sets the Resend global unsubscribe. **There is no way to turn one on**: that stays the person's own act. An account gets its `email_preferences` rows and proof rows (`consent_events`, source and surface `admin`); a person without an account gets proof rows keyed by the email fingerprint. Resend is mirrored best-effort (`resend: "failed"` keeps the D1 change). Audited as `admin.email_pref_off` or `admin.email_stop`.
- `POST /v1/admin/email-preferences/move` — `{ userId, from, to, reason, actorUserId }`, after a sign-in email change in Clerk: the Resend contact (topics, segments, global unsubscribe, `locale`) moves to the new address and the old one is removed. `user_profiles` follows on its own (the Clerk `user.updated` webhook). Audited as `admin.change_email`.

Every audit row carries a **reason code** (`request_email` · `request_phone` · `complaint` · `bounce` · `other`), never free text: `admin_audit` is kept through an erasure, so it must hold no personal data. A person without an account is audited by `fp:<fingerprint>`, never the address.

## Exports

- `readOverrideState(request, env, deps?)` — the GET.
- `applyOverride(request, env, deps?)` — the off-only POST.
- `moveContact(request, env, deps?)` — the move after a sign-in email change.
- `OVERRIDE_REASONS` · `OverrideReason` — the reason codes.

## Source

`code/shared/api/src/consent/admin-overrides.ts`
