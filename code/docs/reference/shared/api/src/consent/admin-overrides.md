---
title: "Admin email overrides (api)"
description: "Read a person's email preferences and turn them off on request — never on."
status: stable
---

# Admin email overrides (api)

> The api half of the admin email panel: read, turn off, stop all, move a contact.

## Purpose

The admin app calls these bearer-gated routes. The bearer is shared by every first-party server, so each route also checks that `actorUserId` holds the **admin role** in `user_profiles` (synced from Clerk by the webhook) — `403` otherwise.

- `GET /v1/admin/email-preferences?userId=` or `?email=`, with `&actorUserId=` — every category with the account's own choice (`granted`, the same state its preference centre shows; `null` for a person without an account) and the Resend topic state, plus the contact's global state (`resend: null` when Resend could not be read). An email that belongs to an account resolves to the account. The view is audited as `admin.view_email_prefs`.
- `POST /v1/admin/email-preferences` — `{ userId | email, off: string[], stopAll?, reason, actorUserId }`. Turns the listed categories off; `stopAll` turns every category off and sets the Resend global unsubscribe. **There is no way to turn one on**: that stays the person's own act — and their own opt-in lifts the global stop again. An account gets its `email_preferences` rows and proof rows (source and surface `admin`); a person without an account gets per-category proof rows by email fingerprint. Either way, `news` and `general` also withdraw the visitor consent they came from (`newsletter`, `waitlist`). Turning `news` off also takes the contact out of every `newsletter-<locale>` segment. Resend is mirrored best-effort (`resend: "failed"` keeps the D1 change). Audited as `admin.email_pref_off` or `admin.email_stop`.
- `POST /v1/admin/email-preferences/move` — `{ userId, from, to, actorUserId }`, after a sign-in email change in Clerk: the Resend contact (topics, segments, global unsubscribe, `locale`) moves to the new address, merged with any contact already there so the more restrictive state wins, and the old one is removed. Every read must succeed first; a failure writes and deletes nothing. `from === to` is refused. The admin action audits the change itself.

Every audit row carries a **reason code** (`OVERRIDE_REASONS`, `@indiecrafts/packages-shared-compliance/shared`), never free text: `admin_audit` is kept through an erasure, so it must hold no personal data. A person without an account is audited by `fp:<fingerprint>`, never the address.

## Exports

- `readOverrideState(request, env, deps?)` — the GET.
- `applyOverride(request, env, deps?)` — the off-only POST.
- `moveContact(request, env, deps?)` — the move after a sign-in email change.

## Source

`code/shared/api/src/consent/admin-overrides.ts`
