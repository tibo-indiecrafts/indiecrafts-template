# Self-service erasure UI (all surfaces) — design

**Status:** design, pending user review.
**Date:** 2026-08-23.
**Builds on:** the Phase-4a erasure engine + API (`code/shared/api/src/erasure/`, `runErasure`, the public `/v1/erasure/request` + `/v1/erasure/confirm` + `/v1/erasure/status/:token` routes) and the Phase-1 `user_profiles` + `fingerprintEmail`.
**Parent roadmap:** the GDPR compliance layer (`docs/superpowers/specs/2026-08-23-gdpr-compliance-layer-design.md`, §22.4 later slices).

## Goal

Give a user a real self-service "delete my data" control on every surface, wired to the existing erasure engine — instead of the backend-only worker HTML forms that ship today.

## Decisions locked (from brainstorming)

1. **Two entry patterns, one engine.**
   - **Authenticated** (a signed-in user on any surface): an in-app control in the **auth section** of the profile → a NEW authenticated worker route `POST /v1/erasure/self` (Clerk-JWT-verified) → runs `runErasure` directly. No email round-trip.
   - **Anonymous** (a website visitor without an account): a **branded email-token flow** (request → emailed link → confirm), reusing the existing public `/v1/erasure/request` + `/v1/erasure/confirm`.
2. **Placement = the auth section of every profile.** The delete control co-locates with each surface's existing Clerk signed-in UI, not a standalone page.
3. **Website keeps the DSAR form.** The manual `/data-request` form (all 7 rights) stays for the other six rights; the automated erasure is added alongside and cross-linked.
4. **Sequential build, report between slices.** Four slices, each its own plan + SDD review cycle.

## Architecture

```
Signed-in surface (website · app · mobile · hybrid)
  auth section → DeleteAccount control → confirm gate (type email + Clerk re-auth)
    → POST /v1/erasure/self  (Authorization: Bearer <Clerk session JWT>)
        → verify JWT → resolve userId + primary email → typed-email match
        → runErasure(defaultAdapters, email, {mode:"erase", fingerprint})
        → erasure_requests audit row + admin_audit + completion email
        → 200 clean / 207 partial → client: Clerk sign-out + redirect

Anonymous website visitor
  /[locale]/erasure (branded form + Turnstile) → POST /v1/erasure/request → emailed link
  /[locale]/erasure/confirm?token= (branded, typed email) → POST /v1/erasure/confirm
```

Both patterns terminate in the same Phase-4a engine and the same `erasure_requests` audit trail.

---

## Section 1 — Worker route `POST /v1/erasure/self` (authenticated)

**File:** `code/shared/api/src/erasure/self.ts` (+ `self.test.ts`); dispatched from `code/shared/api/src/index.ts`.

**Contract:** `handleErasureSelf(request, env, ctx?, buildAdapters = defaultAdapters, verifyClerk?)`.

**Flow (fail-closed at each step):**
1. `OPTIONS` → 204 `PUBLIC_CORS_POST`. Non-`POST` → 405. Body cap `BODY_MAX`.
2. **Availability preflight** (mirror `confirm.ts`): `!env.DB || !env.GDPR_FINGERPRINT_SALT` → 503; and when `buildAdapters === defaultAdapters`, the same secret preflight as confirm (`CLERK_SECRET_KEY` + Sanity secrets) → 503. `!env.CLERK_SECRET_KEY` → 503 regardless (JWT verification needs it).
3. **Verify the Clerk session JWT.** Read `Authorization: Bearer <token>`; verify with `@clerk/backend` `verifyToken(token, { secretKey: env.CLERK_SECRET_KEY })` (fetches Clerk JWKS; cache per isolate). Invalid/expired/missing → 401. Extract `userId` from the `sub` claim. `verifyClerk` is an injectable seam for tests (the vitest-pool-workers isolate can't reach a real Clerk verify).
4. **Resolve the primary email** for `userId` via the existing real Clerk client (`getUser`), reusing `clerk-client.ts`. No user / no email → 422 (`{error:"no_email"}`).
5. **Deliberate-action gate.** The client must send the user's own typed email in the body. `safeEqual(fingerprintEmail(typedEmail), fingerprintEmail(primaryEmail))` (constant-time) must match, else 400. (Even a valid session cannot delete without a deliberate typed confirmation; a bearer-JWT POST is not CSRF-able.)
6. **Run the engine** exactly as `confirm.ts` does: dry-run then live `runErasure(adapters, primaryEmail, {mode:"erase", dryRun, ts, fingerprint})`, `fingerprint = fingerprintEmail(primaryEmail)`.
7. **Audit + record.** Insert an `erasure_requests` row for the proof-of-erasure trail. The table's `token_hash` is `NOT NULL` and there is no token here → store `sha256Hex("self:" + crypto.randomUUID())` (a throwaway hash; never emailed, never used). Status `completed`/`confirmed` per `receipt.errors`; set `requested_at = confirmed_at = ts`, `completed_at` per clean/partial, `result` = receipt JSON. **No migration.** Then the `admin_audit` row (`event = "erasure.self"`, actor+target = `userId`), inside a try/catch (M-1 pattern). Completion email best-effort.
8. **Rate-limit** via `AGENT_RATELIMIT` when bound (keyed by `userId`).
9. **Response:** 200 clean / 207 partial (mirror `confirm.ts`).

**Env:** no new secrets — `CLERK_SECRET_KEY` already exists. Note in the api brief + wrangler that it is now also required for `/v1/erasure/self`.

**Tests (real D1 + injected `verifyClerk`/adapters):** valid JWT + matching typed email → engine runs, row `completed`, 200; typed-email mismatch → 400, nothing mutated; invalid/absent JWT → 401; partial store failure → 207 `confirmed`; missing `CLERK_SECRET_KEY` → 503; no real Clerk/JWKS network call fires.

---

## Section 2 — Shared web/DOM `DeleteAccountSection`

**File:** `code/packages/web/compliance/src/account/DeleteAccountSection.tsx` (+ test + Storybook story). Consumed by website, app, hybrid (all React DOM + Clerk).

- A card/section rendering a destructive "Delete my account and data" control with a confirmation dialog: **type your email** + a short retained-data notice + a Clerk re-auth step (`useReverification` where available, else a typed-email gate alone).
- On confirm: `getToken()` (Clerk) → `POST ${apiBase}/v1/erasure/self` with the bearer JWT + typed email → on 200/207 show the outcome, then `signOut()` + redirect to a farewell/home route.
- Copy comes from props (i18n resolved by each surface, per the repo pattern — mirrors `DataRequestForm`). No hard-coded strings.
- `apiBase` is passed in (each surface already has its env base URL: `NEXT_PUBLIC_API_URL`, etc.).

**Placement per DOM surface (the "auth section"):**
- **website:** the Clerk `<UserProfile>` custom page (mounted where `AuthMenu`/`UserButton` lives) — or a gated `/[locale]/account` page rendering `<UserProfile>` with the custom "Delete account" page. Signed-in only.
- **app:** the app's Clerk signed-in area (add the `<UserProfile>` custom page / account route).
- **hybrid:** the `SignedInView` in `src/renderer/src/auth.tsx`.

---

## Section 3 — Website anonymous branded email-token flow

- **Pages:** `/[locale]/erasure` (branded request form + the Turnstile widget) and `/[locale]/erasure/confirm?token=…` (branded typed-email confirm). Both post cross-origin to the public worker routes (CORS `*` already set).
- **Reuse:** the styling/shape of `DataRequestForm`; a new `ErasureRequestForm` + `ErasureConfirmForm` in `packages/web/ui-components` or `packages/web/compliance`.
- **DSAR link:** the `/data-request` page + the footer link to `/[locale]/erasure` for the fast automated erasure path. DSAR keeps the other six rights.
- **i18n:** new `messages.legal.erasure.*` keys.

---

## Section 4 — Mobile (Expo/RN)

- **File:** `code/packages/mobile/ui-native/src/.../DeleteAccountSection.tsx` (RN) + a mount in the mobile `SignedInView` (`app/sign-in.tsx`).
- Same flow: confirm dialog (type email) → Clerk Expo `getToken()` → `POST ${EXPO_PUBLIC_API_URL}/v1/erasure/self` → `signOut()`.
- Copy via i18n; no hard-coded strings.

---

## Cross-cutting

- **Feature flags:** gate each surface's erasure UI behind `features.*.erasure` (mirrors `features.legal.dataRequest`).
- **Post-delete:** always Clerk `signOut()` + redirect; the account no longer exists after a clean run.
- **i18n:** new message keys per surface (`legal.erasure.*` / account-section keys), all locales.
- **Config-first:** no hard-coded brand/URL/copy; route via `@/i18n/routing`; strings in `messages/`.
- **Docs:** update `code/docs/apps/web/config/data-retention.md` (the self-service route + the auth-section UI); add `code/docs/apps/web/features/` erasure page + sidebar line; api `CHANGELOG` + api brief for `/v1/erasure/self`.

## Slicing (sequential; report between)

1. **Slice A — Worker `/v1/erasure/self`** (Section 1). Prerequisite for the signed-in surfaces. Backend + tests + docs.
2. **Slice B — Shared web/DOM `DeleteAccountSection`** (Section 2) + wire into **website + app + hybrid** auth sections + i18n + flags.
3. **Slice C — Website anonymous branded flow** (Section 3) + DSAR cross-link + i18n.
4. **Slice D — Mobile** (Section 4) RN section + wire into `SignedInView` + i18n.

Each slice: brainstorm-confirmed here → its own plan (`writing-plans`) → SDD build + review, reported before the next.

## Security

- The self route's authorization is the verified Clerk JWT; the typed-email match is a deliberate-action gate, not the auth. Fail-closed on every check (JWT, secrets, email match).
- No token, secret, write token, or fingerprint is ever logged or returned (reuse the Phase-4a discipline — `logger.error({name})` only; the receipt returns store + `error.name`).
- The anonymous flow keeps the Phase-4a anti-enumeration + hashed-token + TTL + attempt-cap spine unchanged.
- Turnstile + rate-limit remain operator-armed on the public request route (see the data-retention operator checklist).

## Testing

- Worker: as Section 1 (real D1, injected Clerk verify + adapters).
- Web `DeleteAccountSection`: component test (confirm gate blocks until email typed; posts the bearer token; signs out on success) + Storybook.
- Website pages: render + post-shape tests.
- Mobile: RN component test.

## Out of scope (deferred)

- The other DSAR rights moving off Sanity to D1 (`data_requests` table) — a separate later slice.
- The SLA clock (cron flags approaching/breached `due_at`).
- The full Sanity-editable email catalog.
- Admin surfacing of partial (207/`confirmed`) erasures + an alert (the "team notified" copy is still aspirational).

## Open questions for the reviewer

- **Web auth-section mount:** Clerk `<UserProfile>` custom page vs. a dedicated gated `/[locale]/account` route rendering it — default is the `<UserProfile>` custom page (truest "in the auth section"); confirm the app/website already mount `<UserProfile>` somewhere or whether a new account route is acceptable.
- **Re-auth strength:** typed-email gate alone vs. also requiring Clerk `useReverification` (password/OTP re-entry) before the destructive call — default is typed-email + reverification where the Clerk plan supports it, typed-email alone otherwise.
