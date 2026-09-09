# Commercial-email consent (`marketing_email`) — design

**Date:** 2026-09-09
**Status:** approved design, ready for an implementation plan.

## Goal

Let a user opt in to commercial (marketing) emails. Capture the choice at sign-up, nudge
existing users once after sign-in, and make it editable in account settings. Store the proof
in the GDPR consent log and the current state on the identity profile. Mirror each decision to
a Resend audience. Show the status per user in the admin dashboard.

**Capture only** — no campaign sending is built here. The Resend audience is populated so a
later sender can use it; nothing sends in this work.

## Constraints (global — every task inherits these)

- **Opt-in is unchecked by default** on every surface. A pre-ticked marketing box is invalid
  consent (CJEU Planet49). The default stored value is "no decision," never "granted."
- **Never commit `.env*`** — only `.env.example`. Never expose a non-public token under
  `NEXT_PUBLIC_` / `EXPO_PUBLIC_` / `VITE_`.
- **`consent_events` is the immutable proof** — append-only, never updated in place.
- **Data minimization** — `consent_events` never stores raw email (keeps the salted
  `email_fingerprint`). Raw email lives only on `user_profiles`, which already holds it.
- Read from `@/config`, route via `@/i18n/routing`, strings in `messages/<locale>.json`.

## The two stores (the "which DB" answer)

Both tables live on **MAIN_DB / `main` D1** (identity tier, EU-resident).

| Store                            | Table                                            | Role                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proof (legal record)**         | `consent_events` (exists)                        | append-only audit — `ts`, `policy_version`, `surface`, `source`, `country`, `idempotency`. Already accepts `consent_type = "marketing_email"`. Unchanged schema. |
| **Current state (display/edit)** | `user_profiles.marketing_email` (**new column**) | `NULL` = never decided · `0` = opted out · `1` = opted in. Mirrors the existing `locale` column. O(1) read for settings + admin.                                 |

Migration `0008_user_profiles_marketing_email.sql` — `ALTER TABLE user_profiles ADD COLUMN
marketing_email INTEGER` (expand-only; D1 has no down-migration).

The current-state column is a denormalized cache of the latest decision. `consent_events`
remains the source of truth for history and proof.

## Capture points

### 1. Sign-up (website · app · mobile · hybrid) — unchecked

- **Web** (`website`, `app`): Clerk's prebuilt `<SignUp>` cannot host custom fields, so an
  unchecked checkbox renders **above** the `<SignUp>` card (in `SignUpView`,
  `@indiecrafts/packages-web-auth`). Its React state feeds
  `unsafeMetadata={{ locale, marketing_email }}`.
- **Mobile / hybrid**: the value goes into the existing custom
  `signUp.create({ unsafeMetadata })`.
- **Webhook mirror** (`POST /v1/clerk-webhook`, `user.created`): read
  `unsafe_metadata.marketing_email`, validate it is a boolean, and
  1. set `user_profiles.marketing_email` **on the INSERT only**;
  2. write one `consent_events` proof row (`source: "signup"`, idempotency
     `signup:<userId>:marketing_email`);
  3. sync the Resend contact (raw email is in the Clerk payload).
- **Subtlety:** `marketing_email` is set only on `user.created`. It is **omitted from the
  `ON CONFLICT DO UPDATE` set clause**, so a later `user.updated` never re-applies the stale
  sign-up value over a settings change. (`locale` keeps its `COALESCE`; it has no other writer.)

### 2. Sign-in nudge (existing users / social sign-ups)

Hosted `<SignIn>` has no slot, so the nudge is **not** inside the Clerk form. After sign-in,
when `user_profiles.marketing_email IS NULL`, a one-time dismissable banner asks:
"Want occasional product emails? [Yes] [No thanks] [×]".

- `[Yes]` / `[No thanks]` record a decision through the consent path → the flag flips non-null
  → the nudge never shows again.
- `[×]` snoozes via `localStorage` (per-device, `${site.prefix}.mkt-nudge-snooze`). No server
  "asked" column (YAGNI). A user who never decides may see it again on a fresh device — an
  acceptable, honest outcome.
- Mounts like the cookie banner: web in `[locale]/layout.tsx` (gated on signed-in); native
  shells mount the shared component. Copy is injected (no i18n dep in the brick).

### 3. Account settings — editable toggle

A "Commercial emails" toggle in the account modal, server-backed (distinct from the
`localStorage` cookie categories in `AccountConsentTab`). It reads its initial state from the
api and writes through the consent path. Wired via the `account-port` abstraction so each
surface supplies its own transport.

## API surface (all on `@indiecrafts/shared-api`)

| Endpoint                                  | Auth      | Change                                                                                                                                                                                                             |
| ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST /v1/events` (`kind:consent`)        | bearer    | **extend** — on a `marketing_email` event for a known `userId`, after writing the proof row also `UPDATE user_profiles SET marketing_email = ?` and sync the Resend contact (email resolved from `user_profiles`). |
| `GET /v1/consent/marketing-email`         | Clerk JWT | **new** — returns the caller's own `{ marketing_email: boolean \| null }`. Feeds the settings toggle + the nudge "should I show?".                                                                                 |
| `POST /v1/profiles/consent`               | bearer    | **new** — batch `{ userIds: string[] }` → `{ [userId]: 0 \| 1 \| null }`. Feeds the admin column.                                                                                                                  |
| `POST /v1/clerk-webhook` (`user.created`) | Svix      | **extend** — mirror + proof row + Resend sync (above).                                                                                                                                                             |

### Resend audience sync

New module `code/shared/api/src/resend-audience.ts`, sibling of `erasure/email.ts` (reuses the
`RESEND_API_KEY` env + the inline `fetch` pattern; no `server-only`, no new deps).

- `upsertResendContact(env, { email, granted })` — create-or-update the contact in the audience
  with `unsubscribed = !granted`.
- `deleteResendContact(env, { email })` — remove the contact (used by erasure).
- New env var **`RESEND_AUDIENCE_ID`**. Unset → every function no-ops, so the feature degrades
  to capture-only when Resend is unconfigured.
- **Best-effort** — a Resend failure is logged (`logger.error`) and never blocks the D1 write or
  the webhook 200. `user_profiles` + `consent_events` stay the source of truth; Resend is a
  downstream mirror.
- The email address is resolved from `user_profiles.email` (plaintext there by design). The
  webhook path already holds the raw email from Clerk.

### Erasure — pure delete

On account deletion / erasure, **delete the Resend contact** (`deleteResendContact`), as a
best-effort step in the existing `code/shared/api/src/erasure/` adapter set. It fires whether
deletion comes via self-service erasure, the DSAR/admin path, or the Clerk `user.deleted`
webhook. Right-to-be-forgotten removes the email from the audience entirely — no retention, no
second/"former members" audience (a deliberate, documented decision).

## Admin user list

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/users/page.tsx` reads users from
Clerk directly. After fetching the 50 users, it calls `POST /v1/profiles/consent` with their ids
and merges an **"Emails"** column: ✓ opted in · ✗ opted out · — not asked. Needs `API_URL` +
`APP_API_TOKEN` in the admin env (add to `.env.example`). One `messages` key per new label.

## QA ledger card

A new card in the QA Runbook artifact covering:

- unchecked default at sign-up (each surface);
- opt-in stored — `wrangler d1 execute … --command "SELECT user_id, marketing_email FROM
user_profiles …"`;
- the `consent_events` proof row (`source:"signup"`);
- the sign-in nudge for a `NULL`-flag user (Yes/No records; × snoozes);
- the settings toggle round-trip (read + write);
- the Resend audience: contact present + subscribed on opt-in, unsubscribed on opt-out;
- **erasure → contact gone from the audience**;
- admin "Emails" column reflects the stored value;
- capture-only — no marketing email actually sends;
- the standard "admin link with the feature" checkbox.

## Testing

- **api** (vitest): the webhook mirror (created sets, updated does not clobber) + sign-up proof
  row; the `/v1/events` column update + Resend sync call; `GET /v1/consent/marketing-email`;
  `POST /v1/profiles/consent`; `resend-audience.ts` upsert/delete with an injected `fetch`
  (subscribe, unsubscribe, delete, no-op when `RESEND_AUDIENCE_ID` unset); the erasure deletion
  step.
- **web** (per surface `tsc`): sign-up checkbox → `unsafeMetadata`; the nudge visibility logic;
  the settings toggle.
- No campaign-send tests — nothing sends.

## File map

**Create**

- `code/shared/api/db/main/migrations/0008_user_profiles_marketing_email.sql`
- `code/shared/api/src/resend-audience.ts` (+ `resend-audience.test.ts`)
- `code/shared/api/src/consent/marketing-read.ts` (or inline routes in `index.ts`) — the two new
  reads
- the sign-in nudge component in `code/packages/shared/compliance/src/{web,native}/` + the
  shared `messages` copy
- `docs/superpowers/plans/2026-09-09-marketing-email-consent.md` (the implementation plan)

**Modify**

- `code/shared/api/src/index.ts` — webhook mirror + proof + Resend sync; `/v1/events` column
  update + sync; two new routes; env typing for `RESEND_AUDIENCE_ID`.
- `code/shared/api/src/erasure/*` — the Resend contact deletion step.
- `code/packages/web/auth/src/sign-up-view.tsx` — the checkbox above `<SignUp>`.
- `code/projects/web/surfaces/{website,app}` — sign-up page passes the value; layout mounts the
  nudge.
- `code/projects/mobile/surfaces/main/app/sign-in.tsx` · `code/projects/hybrid/.../auth.tsx` —
  checkbox → `signUp.create` metadata.
- the account modal + `account-port` — the settings toggle.
- `code/projects/web/surfaces/admin/.../users/page.tsx` + admin `messages` + `.env.example` —
  the column.
- `code/shared/api/wrangler.toml` + `.dev.vars.example` — `RESEND_AUDIENCE_ID`.
- docs: `code/docs/shared/architecture/auth.md` (or a compliance doc) + the api brief +
  `CHANGELOG.md`.
- the QA Runbook artifact — the new card.

## Out of scope (YAGNI)

- Sending campaigns / broadcasts.
- Any provider besides Resend.
- Double opt-in (a confirmation email) — single opt-in via the unchecked box is valid consent.
- A second / "former members" audience — deletion is a pure delete.
- Writing `marketing_email` back to Clerk metadata — `user_profiles` is the source of truth.
- Marketing-consent re-versioning.
