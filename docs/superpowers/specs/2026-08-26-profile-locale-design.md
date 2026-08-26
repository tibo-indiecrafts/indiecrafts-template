# Profile locale — design spec

- **Date:** 2026-08-26
- **Status:** Draft for review
- **Scope:** `code/shared/api` (worker + core D1), `code/packages/web/auth`, `code/packages/web/ui-components`, `code/packages/web/email`, the three web surfaces (`website`, `app`, `admin`).

## Problem

A signed-in user has one language. Today the platform never stores it as a
profile attribute, so an email to that user cannot pick their language. We want:

1. **Detect** the user's locale automatically and store it on their profile.
2. Let the user **adjust** it from a settings page on every surface that has one.
3. Make **every outbound email** use the localized copy when it exists, and fall
   back cleanly when it does not.

## Findings — current state

The read established these facts. They shape the whole design.

- **`user_profiles.locale` already exists but is dead.** The column is declared in
  `code/shared/api/db/core/migrations/0001_user_profiles.sql:16`. Nothing writes it:
  the login upsert sets only `user_id/created_at/last_login_at`
  (`code/shared/api/src/index.ts:373`); the Clerk webhook sets `email/full_name/
  email_fingerprint` (`code/shared/api/src/index.ts:961`). Nothing reads it. **No
  migration is needed** — only wiring.
- **`user_profiles` is the D1 mirror of Clerk users** (auth = Clerk), keyed by the
  Clerk `user_id`, written on sign-in (session event) and by the Clerk webhook. It
  lives in the EU core D1 (`CORE_DB`) and is the primary target of GDPR erasure.
- **Two email populations, no overlap:**
  - *Anonymous visitors* — newsletter / waitlist / contact / blog-comment. Stored
    as Sanity docs. Locale is captured at the form via `useLocale()` and saved to
    `subscriber.language`. These emails already localize. They have no profile row.
  - *Authenticated Clerk users* — have a `user_profiles` row. **No transactional
    email targets them by `user_id` today** (Clerk sends its own auth mail,
    localized by Clerk). So the profile-locale read path is a forward-looking
    primitive, not a retrofit of the anonymous senders.
- **Email copy is already locale-resolved.** The `emailStrings` singleton stores
  per-locale `localeString`/`localeText` copy. `pick(value, locale)` in
  `code/packages/web/email/src/strings.ts:73` already implements "localized if it
  exists, else default locale, else empty". The gap is upstream: *which* locale we
  hand to `pick`.
- **Existing patterns to mirror** (reuse, do not invent):
  - Authenticated worker write: `code/shared/api/src/erasure/self.ts` — Clerk
    session JWT proves identity, then a D1 write.
  - Self-service settings UI: `code/projects/web/surfaces/app/src/app/[locale]/account/page.tsx`
    renders shared sections (`DeleteAccountSection`/`ExportSection` from
    `@indiecrafts/packages-shared-compliance/web`) gated behind Clerk +
    `NEXT_PUBLIC_API_URL`.
  - Session detect chain: `SessionLogger` + `logSession` live once in
    `@indiecrafts/packages-web-auth`; each surface's `/api/session-log` route
    forwards to the worker `/v1/events`.

## Goals / non-goals

**Goals**

- Store a real locale on `user_profiles`, populated by detection and by an explicit
  user choice.
- Expose a locale selector on all three web surfaces that have a settings home.
- Provide one read hook so any email to a known user resolves their profile locale.
- Define one recipient-locale precedence rule used by every sender.

**Non-goals**

- No new migration (the column exists).
- No retrofitting the anonymous senders — they already carry their captured locale.
- No settings screen invented for `mobile`/`hybrid` (they have none yet) — noted
  follow-up.
- No change to owner-alert emails — internal, stay on `defaultLocale`.
- No `locale_source` flag (see the one decision below).

## Design

### 1. Data — populate `user_profiles.locale`

Two write paths, one column.

**Detect (automatic, first-login-wins).** Thread `locale` through the existing
session chain:

1. `SessionLogger` (`@indiecrafts/packages-web-auth/session-logger.tsx`) reads
   `useLocale()` and includes `locale` in its POST body.
2. Each surface's `/api/session-log/route.ts` passes `locale` into `logSession(...)`.
3. `logSession` (`@indiecrafts/packages-web-auth/session-log`) forwards `locale` to
   the worker `/v1/events`.
4. The worker session branch (`code/shared/api/src/index.ts` ~line 351) validates it
   with `isLocale(locale, localeCodes)` and stamps the upsert:

   ```sql
   INSERT INTO user_profiles (user_id, created_at, last_login_at, locale)
   VALUES (?, ?, ?, ?)
   ON CONFLICT(user_id) DO UPDATE SET
     last_login_at = excluded.last_login_at,
     locale = COALESCE(user_profiles.locale, excluded.locale);
   ```

   `COALESCE(existing, new)` means detection sets the locale **only on first login**;
   a later login never overwrites a value already there. The explicit path (below)
   is the only thing that changes it afterwards.

**Adjust (explicit, always wins).** The settings endpoint overwrites unconditionally
(`SET locale = ?`).

Wiring the detect path once in `@indiecrafts/packages-web-auth` covers all three
surfaces.

### 2. Adjust endpoint — `POST /v1/profile/locale`

A new authenticated route in the `api` worker, mirroring `erasure/self.ts`.

- **Auth:** Clerk session JWT proves identity (same verification as `/v1/erasure/self`).
  The `userId` comes from the JWT, never from the body.
- **Body:** `{ locale: string }`. Validate with `isLocale(locale, localeCodes)` →
  `400` on a bad value.
- **Write:** `UPDATE user_profiles SET locale = ? WHERE user_id = ?`. No other column
  touched (email, fingerprint, erasure state untouched).
- **Guard:** `503` if `CORE_DB` is unbound. Rate-limited like the sibling routes.
- **Response:** `{ locale }` on success.

New file: `code/shared/api/src/profile/locale.ts` (handler), wired in
`code/shared/api/src/index.ts` beside the `/v1/erasure/self` and `/v1/export` routes.

### 3. Read hook — `getProfileLocale`

The primitive every future authenticated-user email calls.

```ts
// code/shared/api/src/profile/locale.ts (or a read module)
async function getProfileLocale(
  userId: string,
  env: Env,
): Promise<Locale | null>; // SELECT locale FROM user_profiles WHERE user_id = ?
```

Returns the stored `Locale`, or `null` when absent / unknown. Callers fall back via
the precedence rule below. Ship the hook now; do not retrofit the anonymous senders.

### 4. Email integration — recipient-locale precedence (the unified rule)

Every sender resolves one **recipient locale**, then hands it to `pick(copy, locale)`.
`pick` already does "localized copy if it exists, else default-locale copy, else
empty", so the only new thing is a single precedence chain for the locale itself:

1. **Profile locale** — `getProfileLocale(userId)` when the recipient is a known
   Clerk user.
2. **Captured locale** — `subscriber.language` / the form's `language` for anonymous
   flows.
3. **`defaultLocale`** — final fallback.

Consequences:

- **Authenticated-user emails** (none today; the forward-looking case) resolve step 1,
  then fall through. When such a sender is added it reads `getProfileLocale` and needs
  no other locale plumbing.
- **Anonymous senders** are unchanged — they already start at step 2. We do **not**
  edit them.
- **Owner-alert emails** stay on `defaultLocale` (internal, untranslated) — out of
  the chain by design.

This satisfies "for all emails, if a localized version exists, use it": the localized
copy is used whenever `pick` finds it for the resolved locale; the resolved locale
prefers the user's profile, then their captured locale, then the default.

Optional small helper to make the chain one line at each future call site:

```ts
// resolveRecipientLocale({ userId?, captured? }) → Locale
```

### 5. Surface UI — one shared component, three consumers

A `LocalePreference` client component in `@indiecrafts/packages-web-ui-components`
(the design-system brick all surfaces already import). Props: `apiUrl`, current
`locale`, and a copy object. It renders a labelled `<select>` of the configured
locales and POSTs the choice to `/v1/profile/locale`, showing pending / success /
error states. One component, so the three surfaces never re-implement the fetch or
the option list.

Each surface then:

- Drops `<LocalePreference>` into its settings home:
  - `website` → `/[locale]/account/page.tsx`
  - `app` → `/[locale]/account/page.tsx`
  - `admin` → `/[locale]/(dashboard)/settings`
- Adds an `account.locale.*` (or `settings.locale.*`) namespace to its
  `messages/<locale>.json` (label, description, save button, pending, success, error).
- Gates it behind Clerk configured + `NEXT_PUBLIC_API_URL` set — the same fail-safe as
  the delete/export sections (no control that could only ever 404 on submit).
- Passes the user's current locale to pre-fill the selector (read from the profile, or
  fall back to the active request locale on first paint).

### 6. Follow-ups (noted, out of scope)

- **`mobile` / `hybrid`** have Clerk auth refs but no settings screen. Add
  `LocalePreference` (or its native equivalent) when they grow one.
- **First authenticated-user email.** When one is added, wire it to
  `resolveRecipientLocale` — this is where the read hook pays off.
- **`locale_source` flag** — only if the detect-vs-explicit behaviour below needs to
  change.

## The one decision baked in

**Detect vs. explicit conflict → `COALESCE` (first-login / explicit wins).**

- Auto-detect stamps the locale only on the *first* login; later logins never
  overwrite it. The settings page is the only thing that changes it afterwards.
- Simplest, no new column, preserves an explicit choice.
- **Trade-off:** if the user's first sign-in happens from the "wrong" locale, they
  stay on it until they open settings. Acceptable — the control to fix it is one page
  away.
- **Alternative (rejected for now):** a `locale_source` column (`detected`/`explicit`)
  so detection keeps following the browser until the user sets it explicitly. More
  logic + a migration. Revisit only if the simple rule proves wrong.

## File-by-file change list

**`code/shared/api`**

- `db/core/migrations/*` — none (column exists).
- `src/index.ts` — session branch: read + validate `body.locale`, add it to the
  `user_profiles` upsert with `COALESCE`. Register `POST /v1/profile/locale`.
- `src/profile/locale.ts` — new: `handleProfileLocale` (authenticated write) +
  `getProfileLocale` (read).

**`code/packages/web/auth`**

- `src/session-logger.tsx` — include `useLocale()` in the POST body.
- `src/session-log.ts` — forward `locale` to `/v1/events`.

**`code/packages/web/ui-components`**

- `src/web/.../LocalePreference.tsx` — new shared selector component (+ story).

**`code/packages/web/email`**

- Optional `resolveRecipientLocale(...)` helper beside `pick`/`getEmailStrings`. No
  change to `pick` — it already resolves localized-or-fallback copy.

**Surfaces** (`website`, `app`, `admin`)

- `/api/session-log/route.ts` — pass `locale` into `logSession(...)`.
- Settings page — render `<LocalePreference>`, gated.
- `messages/{en,fr}.json` — the `account.locale.*` keys.

## Testing

- **Worker unit tests** (Vitest, `cloudflare:test`, mirroring
  `user-profiles.test.ts` / `clerk-profile-sync.test.ts`):
  - session upsert stamps `locale` on first login; a second login with a different
    locale does **not** overwrite (COALESCE).
  - `POST /v1/profile/locale` — happy path writes; bad locale → `400`; missing JWT →
    `401`; unbound `CORE_DB` → `503`; overwrite always wins.
  - `getProfileLocale` returns the stored value, `null` when absent.
- **Precedence helper** unit test — profile → captured → default order.
- **Component** — `LocalePreference` renders options, POSTs the choice, shows
  success/error (Storybook + a render test).

## Open questions

1. Message namespace name — `account.locale.*` vs `settings.locale.*`? (Admin's home
   is `settings`; app/website use `account`.) Pick one key set, reuse across surfaces.
2. Selector pre-fill on first paint — read the profile server-side, or default to the
   active request locale until the user saves? (Leaning: request locale; the profile
   value is what the save reflects.)
3. Confirm `LocalePreference` belongs in `ui-components` vs a small account-section
   sibling of the compliance sections. (Leaning: `ui-components` — it is not
   compliance.)

## Issue tags

- `@debt VESTIGIAL` — `user_profiles.locale` ships today unwritten and unread; this
  spec makes it real.
