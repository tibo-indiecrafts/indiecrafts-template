# Email Preferences Management — Design

**Status:** Draft for review · **Date:** 2026-09-10

## Goal

Extend the current single marketing-email opt-in into a **preference centre**: multiple
**Sanity-editor-defined** marketing categories a user can opt into individually, plus a
read-only "Account & security" transparency section, reachable both signed-in and from a
**no-login email link** (tokenised page + RFC 8058 one-click unsubscribe). Capture-only
(no sender is built yet); this makes the capture granular, lawful, and clear.

## Decisions (locked with the requester)

1. **Categories are Sanity-defined** — editors add / rename / reorder categories and their
   localized copy without a deploy. Each category has a **stable, immutable `key`** (the DB +
   Resend contract): display and order are editable, the key is not.
2. **Scope** — granular opt-in for **marketing** categories, PLUS an **always-on
   "Account & security" section** shown for transparency but **not disableable** (mirrors the
   security-alert "no toggle" rule).
3. **No-login access now** — a signed-token public preference page + one-click
   `List-Unsubscribe` (RFC 8058), so the infrastructure is ready when a sender lands.
4. **On/off per category only** — no frequency / cadence control.

### Sub-decisions (defaulted; requester approved "do it")

- **Default state:** every marketing category defaults **OFF** (GDPR explicit opt-in, no
  pre-ticked boxes).
- **Migration:** the legacy `user_profiles.marketing_email` boolean seeds one reserved
  category `news`; existing opt-ins are preserved. `marketing_email` then becomes a **derived**
  "any marketing category granted" cache.
- **Sign-up checkbox:** stays a single unchecked "marketing emails" opt-in; ticking it grants
  the editor's `includeAtSignup` category set. Granular control lives in the preference centre.
- **Token:** HMAC-signed, user-scoped preference token (reusing `@indiecrafts/packages-shared-gated-delivery`),
  reveals no PII, authorises only preference reads/writes.
- **Resend — SUPERSEDED 2026-09-10 → use Topics.** Verified against Resend's API: `unsubscribed` is
  global per contact (not per-audience) and **Topics** are the per-category primitive, so the model is
  **one audience + a Resend Topic per category** (field `resendTopicId`), mirrored via a contact upsert
  with `topics:[{id,subscription:opt_in|opt_out}]`. Live wiring is credential-gated (invalid local key).
  The original per-category-audience text below is retained for history only.
- **Resend — one audience per category (superseded, see above).** A Resend "audience" is a list and a contact carries
  only one `unsubscribed` flag, so topics can't be split inside one audience. Each Sanity
  category therefore carries an optional **`resendAudienceId`**: the editor creates the audience
  in Resend, pastes its id, and the api mirrors that category's opt-in/out to that audience
  (`unsubscribed = !granted`). D1 stays the source of truth; a category with no `resendAudienceId`
  is D1-only (no mirror). The legacy single `RESEND_AUDIENCE_ID` env becomes the default for the
  seeded `news` category (backward-compat). See "Ops — creating Resend audiences" below.

## Global constraints (from the repo)

- Never commit `.env*` (only `.env.example`); never expose a non-public token under
  `NEXT_PUBLIC_`/`EXPO_PUBLIC_`/`VITE_`.
- `api`/`cron`/`workers` are **shells** — job logic lives in a brick; `withGuard` is Next-only,
  so the token routes use the inline bearer/rate-limit/CORS guard pattern.
- Studio field legends are French, plain-register, for non-technical editors
  (`sanity-legends.md`).
- Consent proof is append-only, keyed by salted **email fingerprint**, never raw email.
- Every user-facing string is Sanity (categories) or `messages/<locale>.json` (chrome); no
  inline copy. Locale reads go through the shared `pickLocale`.

## Architecture overview

```
Sanity emailPreferences singleton   ──(GROQ)──▶  api reads categories + copy
  (email brick: keys + localized copy)                 │
                                                        ▼
Surfaces (web account, mobile account,        GET/POST /v1/consent/email-preferences (JWT)
 public /email-preferences?token) ──────────▶ GET/POST /v1/email-preferences (token)
                                              POST /v1/email-preferences/unsubscribe (1-click)
                                                        │
                                                        ▼
                                     D1 main:  email_preferences (state)  +  consent_events (proof)
                                                        │  derived
                                                        ▼
                                     user_profiles.marketing_email  ──▶ Resend coarse mirror
```

Boundary rule: **the api is the single runtime reader of category definitions** and returns
`{ key, name, description, granted }` resolved to the caller's locale, so neither web nor
mobile has to read the email-category Sanity schema directly (keeps `shared`→`web` deps out).

---

## 1. Sanity schema — `emailPreferences` singleton (email brick)

New singleton in `@indiecrafts/packages-web-email` (owns email Sanity), contributed to the
Studio "Contenu partagé" desk alongside `emailStrings`.

Fields:

- `categories` — array of `emailPreferenceCategory` objects (marketing, toggleable):
  - `key` — `slug`, **required, immutable once set** (a custom validation blocks changing an
    existing key; reserved value `news` ships seeded). This is the DB/Resend contract.
  - `name` — `localeString` (e.g. "News & updates", "Partner communications").
  - `description` — `localeText` (what the user is signing up for).
  - `includeAtSignup` — `boolean` (default false) — granted by the single sign-up checkbox.
  - `resendAudienceId` — `string` (optional) — the Resend audience this category mirrors to
    (editor pastes it after creating the audience in Resend). Unset ⇒ D1-only, no mirror.
  - `order` implied by array position.

  **Seeded starter categories** (editor-editable; keys are permanent):
  - `news` — _News & updates_ — product news, changelog, announcements. `includeAtSignup: true`.
    Migration target for the legacy `marketing_email`; default `resendAudienceId` = the existing
    `RESEND_AUDIENCE_ID` env if set.
  - `offers` — _Offers & promotions_ — discounts and campaigns.
  - `partners` — _Partner communications_ — offers/news from selected partners. (Third-party
    sharing — description states this plainly; strictly default-off, never at sign-up.)
  - `tips` — _Tips & guides_ — educational / onboarding content.

- `notices` — array of `emailPreferenceNotice` objects (transactional, **display-only**):
  - `name` — `localeString` (e.g. "Security alerts", "Account & receipts").
  - `description` — `localeText` ("You always receive these — required to run your account.").
- `centreHeading` / `centreIntro` — `localeString` / `localeText` for the preference page.
- `noticesHeading` — `localeString` for the read-only section.

A colocated test asserts the immutable-key validation and that `news` is seeded.

Reader (email brick, server-only): `emailPreferenceQuery` (GROQ) for the api to fetch over
raw HTTP (mirrors `fetchAnnouncementDocs`/`emailStrings`); never throws → an unset Sanity
yields the seeded `news`-only default so the feature still works.

## 2. Storage + migration (D1 `main`)

New migration (next number in the `main` sequence):

```sql
CREATE TABLE email_preferences (
  user_id      TEXT NOT NULL,
  category_key TEXT NOT NULL,
  granted      INTEGER NOT NULL,          -- 0 | 1
  updated_at   TEXT NOT NULL,
  PRIMARY KEY (user_id, category_key)
);
CREATE INDEX idx_email_prefs_category ON email_preferences (category_key, granted);
```

- **Proof:** each change writes `consent_events` with
  `consent_type = 'email_pref:' || category_key` (namespaced; keyed by fingerprint, with
  `idempotency_key`, `surface`, `policy_version`, `country`). The existing table already takes
  any `consent_type` string.
- **Derived cache:** after any write, recompute
  `user_profiles.marketing_email = (EXISTS granted marketing pref ? 1 : 0)` so the admin
  "Emails" column, the sign-in nudge, and the coarse Resend mirror keep working unchanged.
- **Data migration:** for every `user_profiles` row with a non-null `marketing_email`, insert
  `email_preferences (user_id, 'news', marketing_email, now)`. The seeded `news` Sanity
  category matches, so legacy opt-ins are preserved and immediately manageable.

## 3. API (`shared/api`)

Authenticated (Clerk JWT — reuse `verifyUserId` from `consent/marketing.ts`):

- `GET /v1/consent/email-preferences` → `{ categories: [{ key, name, description, granted, includeAtSignup }], notices: [{ name, description }], marketing_email }`. Merges Sanity category defs (locale-resolved) with the caller's `email_preferences` rows (missing key ⇒ `granted:false`).
- `POST /v1/consent/email-preferences` `{ updates: [{ key, granted }], surface? }` → validates each `key` against the Sanity category set, upserts `email_preferences`, writes one `consent_events` proof per change, recomputes `marketing_email`, and best-effort mirrors each changed category to its `resendAudienceId` (`upsertResendContact`, now parameterised by audience id). Batch.

Public, token-authenticated (no login; the inline bearer/rate-limit/CORS guard, like erasure):

- `GET /v1/email-preferences?token=…` → verify HMAC → same shape as the JWT GET, for that user.
- `POST /v1/email-preferences` `{ token, updates }` → same write path, token-authorised.
- `POST /v1/email-preferences/unsubscribe` — RFC 8058 one-click target. Body is the mail
  client's `List-Unsubscribe=One-Click`; the `token` (query or body) encodes `uid` + optional
  `cat`. Sets that category (or all marketing) `granted=0`, writes proof, returns 200 + a plain
  confirmation. Idempotent.

Token: `sign({ uid, cat? })` / `verify` via `@indiecrafts/packages-shared-gated-delivery`,
secret **`EMAIL_PREF_SECRET`** (new; `.dev.vars.example` + `wrangler.toml` `[vars]` doc only).
Long-lived (links in sent mail must keep working); low-sensitivity (no PII, marketing-prefs
scope only). Unset secret → token routes 503 (capture-only still works signed-in).

Helper (email brick, for a future sender): `emailPreferenceLinks(env, userId, categoryKey?)`
→ `{ manageUrl, unsubscribeUrl }` + the `List-Unsubscribe` / `List-Unsubscribe-Post` header
pair, so marketing sends drop them in when built.

## 4. Surfaces / UX

- **Web** — a shared `EmailPreferences` component (email brick, web) rendering the category
  switches + the read-only notices section from the api response. Mounted in:
  - the account page (`/[locale]/account`, JWT), replacing the single `MarketingEmailToggle`;
  - a public route `/[locale]/email-preferences` (token from the query), same component, token IO.
- **Mobile** — a native `EmailPreferences` list (account screen) replacing `MarketingEmailToggle`,
  driven by the same api response (JWT). Categories + copy come from the api, so mobile needs no
  Sanity coupling.
- **Sign-up** — unchanged single unchecked "marketing emails" checkbox; on `user.created` the
  webhook grants the `includeAtSignup` categories (writes `email_preferences` + proof) instead
  of the single `marketing_email` column, and derives `marketing_email`.
- **Read-only notices** — rendered under the toggles: "You always receive these", no controls.

All copy: category name/description from Sanity; chrome ("Save", section labels) from
`messages/<locale>.json`. Default off; switches reflect stored state; optimistic + error state.

## 5. One-click unsubscribe (RFC 8058)

Future marketing sends include:
`List-Unsubscribe: <https://api…/v1/email-preferences/unsubscribe?token=…>, <mailto:unsub@…?subject=…>`
and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. The POST target unsubscribes the
email's category with no further interaction and links onward to the full preference centre.
Built now (endpoint + helper); wired into the marketing template when a sender exists.

## Ops — creating Resend audiences

Each marketing category maps to one Resend audience. To wire a category:

1. **Create the audience.** Resend dashboard → **Audiences** → **Create Audience** → name it
   after the category (e.g. "News & updates") → copy its **id** (a UUID). Or via API:
   `POST https://api.resend.com/audiences` with `Authorization: Bearer <RESEND_API_KEY>` and
   body `{ "name": "News & updates" }` → returns `{ "id": "…", "name": "…" }`.
2. **Paste the id** into that Sanity category's `resendAudienceId` field (Studio → E-mails →
   Preferences). The api reads it and mirrors opt-ins to that audience.
3. Repeat per category. A category with no id is D1-only (captured, not mirrored).
4. **Sending** additionally needs a **verified domain** (Resend → Domains) — audiences alone
   only need the account. This project is capture-only today; the audiences fill up now and are
   ready when a sender is built.

The app never creates audiences automatically (the editor owns them in Resend). It only
add/updates/deletes **contacts** within an audience, driven by D1 (the source of truth):
opt-in → contact `unsubscribed:false`, opt-out → `unsubscribed:true`, erasure → contact deleted.

## 6. Admin

The users-list "Emails" column keeps showing the derived `marketing_email`. A per-category
breakdown is out of scope (YAGNI) — the data supports it later.

## 7. Erasure

Extend the erasure engine (`erasure/d1.ts` core adapter) to delete the subject's
`email_preferences` rows alongside the existing pseudonymisation, and pure-delete the Resend
contact from **every** category audience (each category's `resendAudienceId`), not just the
legacy one. Add a test.

## Error handling / privacy

- Every change → an append-only `consent_events` proof (fingerprint-keyed, idempotent).
- Token routes: rate-limited (the existing CF binding), no PII in the token or the response
  beyond category state, fail-closed on a bad/absent token.
- Best-effort Resend + derived-column recompute never block the D1 write (the source of truth).
- Default OFF everywhere; no pre-ticked boxes; sign-up stays a single explicit opt-in.

## Testing

- **api:** GET/POST (JWT + token), key validation against Sanity, batch proof writes, derived
  `marketing_email` recompute, one-click unsubscribe (idempotent), token sign/verify, Resend
  coarse mirror best-effort, migration data-move, erasure purge.
- **Sanity:** immutable-key validation + `news` seed test.
- **Web/mobile:** the `EmailPreferences` list renders categories, toggles write, notices are
  read-only, signed-out no-ops (mobile), token path renders without login.

## Deliverables beyond code

- **QA ledger card** — "Email preferences" in the runbook: toggle a category (logged-in + via
  token link), one-click unsubscribe, sign-up grants the at-signup set, add/rename a Sanity
  category and see it reflected, migration preserved a legacy opt-in, transactional stays
  non-disableable — plus the standard **Security-review** + **Sanity-dataset** checkboxes.
- **Docs** — a new `code/docs/` page (`apps/web/config/email-preferences.md`) + its sidebar
  line; update the `shared/api`, `packages-web-email`, and `packages-web-compliance` briefs;
  changelog entries in `code/shared/api`, `code/packages`, and the surface changelogs.

## Out of scope (v1)

Frequency/cadence, an actual marketing sender, automatic Resend audience creation (editors
create them), a per-category admin breakdown, importing preferences from an external ESP.

## Open questions

None blocking. The one convention to confirm at build time: the exact next migration number in
the `main` D1 sequence.
