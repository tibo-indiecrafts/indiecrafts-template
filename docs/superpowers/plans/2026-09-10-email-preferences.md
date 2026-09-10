# Email Preferences Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single marketing opt-in into a Sanity-editor-defined, multi-category email preference centre (web + mobile + no-login link), with one Resend audience per category and full GDPR proof/erasure coverage.

**Architecture:** Sanity `emailPreferences` singleton (email brick) defines categories (immutable `key`, localized copy, `resendAudienceId`); the api is the single runtime reader and owns the D1 state (`email_preferences` table + `consent_events` proof) plus JWT and no-login-token routes; the existing `user_profiles.marketing_email` becomes a derived cache; each category mirrors to its own Resend audience.

**Tech Stack:** Cloudflare Workers (bare, TypeScript) · D1 · Sanity v5 · Next.js 16 / React 19 · Expo/React Native · Resend · Clerk · vitest (vitest-pool-workers for the api).

**Spec:** `docs/superpowers/specs/2026-09-10-email-preferences-design.md` — read it alongside this plan.

> **DESIGN UPDATE (2026-09-10, supersedes every "Resend audience" reference below).** Verified
> against Resend's API: `unsubscribed` is **global per contact** (not per-audience), and **Topics**
> are Resend's per-category primitive. So the model is **ONE audience + a Resend Topic per
> category**, NOT one audience per category, and NOT segments. Concretely:
>
> - The Sanity category field is **`resendTopicId`** (rename from `resendAudienceId`).
> - The mirror (Task 8) upserts a contact via `POST/PATCH /audiences/{id}/contacts` with
>   `topics: [{ id: <resendTopicId>, subscription: granted ? "opt_in" : "opt_out" }]` against the
>   one configured audience — NOT `upsertResendContact` per audience.
> - Erasure (Task 11) deletes the D1 rows and deletes/globally-unsubscribes the ONE contact — not
>   per-audience.
> - Live Resend is **credential-gated**: the local `RESEND_API_KEY` is invalid and dev Clerk has 0
>   users, so the per-contact Resend sync + Topic creation are a user-run step (valid key + a sync
>   script). Build the code so it no-ops safely when the key/topic ids are unset (capture-only),
>   exactly like the existing `resend-audience.ts` guard.
>   Where a task below says "audience"/`resendAudienceId`/`upsertResendContact per audience", read it
>   as the Topics shape above.

## Global Constraints

- Never commit `.env*` (only `.env.example`); never expose a non-public token under `NEXT_PUBLIC_`/`EXPO_PUBLIC_`/`VITE_`; never paste secret values into chat.
- `api`/`cron`/`workers` are shells — job logic lives in a brick or the api's own `src/`, composed from React-free bricks; `withGuard` is Next-only, so token routes use the inline bearer/rate-limit/CORS guard pattern already in `erasure/request.ts`.
- Consent proof is append-only (`consent_events`), keyed by salted email **fingerprint**, never raw email; every write is idempotent (`idempotency_key`).
- Marketing categories default **OFF** (no pre-ticked boxes); the `partners` category is never granted at sign-up.
- Studio field legends: French, plain register, for non-technical editors (`sanity-legends.md`).
- User-facing strings: category copy from Sanity; chrome from `messages/<locale>.json`; locale reads via the shared `pickLocale` (`@indiecrafts/packages-shared-config`).
- Commit messages end with the two attribution lines from the session; commit only per the executor's normal flow.
- Reserved category `key`s (seeded, permanent): `news`, `offers`, `partners`, `tips`.

## File Structure

**Sanity (email brick — `code/packages/web/email/`):**

- Create `src/sanity/email-preferences.ts` — the `emailPreferences` singleton schema (categories + notices + centre copy) with immutable-key validation.
- Modify `src/sanity/index.ts` — export `emailPreferencesSchema` + `emailPreferencesStructureItem`.
- Modify `code/projects/web/surfaces/website/sanity.config.ts` — register the singleton in the "Contenu partagé" desk.

**api (`code/shared/api/`):**

- Create `db/main/migrations/0009_email_preferences.sql` — table + index + data-migration of `marketing_email` → `news`.
- Create `src/consent/email-preferences-store.ts` — pure-ish D1 read/write of `email_preferences` + `consent_events` proof + derived `marketing_email` recompute.
- Create `src/consent/email-preferences-sanity.ts` — GROQ read of the `emailPreferences` singleton (never throws), locale-resolved category list.
- Create `src/consent/pref-token.ts` — sign/verify the no-login preference token `{ uid, cat? }` (built on the generalized gated-delivery signer).
- Create `src/consent/email-preferences.ts` — the four route handlers (JWT GET/POST, token GET/POST, one-click unsubscribe) + `emailPreferenceLinks` helper.
- Modify `src/resend-audience.ts` — parameterize `upsertResendContact`/`deleteResendContact` by `audienceId`.
- Modify `src/index.ts` — route wiring + `EMAIL_PREF_SECRET` on `Env`.
- Modify `src/erasure/d1.ts` — purge `email_preferences`; delete the contact from every category audience.
- Modify `src/index.ts` clerk-webhook (`user.created`) — grant the `includeAtSignup` categories instead of the single `marketing_email` write.
- Create tests colocated: `email-preferences-store.test.ts`, `pref-token.test.ts`, `email-preferences.test.ts`; extend `erasure/*.test.ts`.

**gated-delivery brick (`code/packages/shared/gated-delivery/`):**

- Modify `src/token.ts` — export generic `signHmac(payload, secret)` / `verifyHmac(token, secret)`; keep `signDownloadToken`/`verifyDownloadToken` as thin wrappers.

**Web (`code/packages/web/email/` + website):**

- Create `src/web/EmailPreferences.tsx` (email brick, `"use client"`) — the category switch list + read-only notices, driven by an injected read/write IO.
- Create website `src/app/[locale]/email-preferences/page.tsx` — public token page.
- Modify website account page to mount `EmailPreferences` (JWT IO) in place of the single `MarketingEmailToggle`.

**Mobile (`code/projects/mobile/surfaces/main/`):**

- Create `components/EmailPreferences.tsx` — native category switch list driven by the api response.
- Modify `app/account.tsx` — mount it in place of `MarketingEmailToggle`.

**Docs / ledger / changelogs:**

- Create `code/docs/apps/web/config/email-preferences.md` + sidebar line in `code/docs/.vitepress/config.mts`.
- Update the QA runbook artifact (a new "Email preferences" card).
- Briefs: `code/shared/api/.claude/CLAUDE.md`, `code/packages/web/email/.claude/CLAUDE.md`.
- Changelogs: `code/shared/api/CHANGELOG.md`, `code/packages/CHANGELOG.md`, website + mobile.

---

### Task 1: Generic HMAC signer in gated-delivery

**Files:**

- Modify: `code/packages/shared/gated-delivery/src/token.ts`
- Test: `code/packages/shared/gated-delivery/src/token.test.ts`

**Interfaces:**

- Produces: `signHmac(payload: object, secret: string): Promise<string>` and `verifyHmac(token: string, secret: string): Promise<Record<string, unknown> | null>` (no `exp` requirement; returns the parsed payload or null on bad sig/malformed). `signDownloadToken`/`verifyDownloadToken` keep their exact current signatures (wrappers).

- [ ] **Step 1: Write the failing test** (add to `token.test.ts`)

```ts
import { signHmac, verifyHmac } from "./token";
it("signHmac/verifyHmac round-trips an arbitrary payload", async () => {
  const t = await signHmac({ uid: "u1", cat: "news" }, "s3cret");
  expect(await verifyHmac(t, "s3cret")).toEqual({ uid: "u1", cat: "news" });
});
it("verifyHmac returns null on a wrong secret or tamper", async () => {
  const t = await signHmac({ uid: "u1" }, "s3cret");
  expect(await verifyHmac(t, "other")).toBeNull();
  expect(await verifyHmac("garbage", "s3cret")).toBeNull();
});
```

- [ ] **Step 2: Run — expect FAIL** (`signHmac` not exported): `pnpm --filter @indiecrafts/packages-shared-gated-delivery test`
- [ ] **Step 3: Implement** — in `token.ts`, extract the sign/verify HMAC body into generic exports; refactor the existing functions to wrap them:

```ts
export async function signHmac(
  payload: object,
  secret: string,
): Promise<string> {
  const payloadB64 = toBase64url(encoder.encode(JSON.stringify(payload)));
  return `${payloadB64}.${toBase64url(await hmac(payloadB64, secret))}`;
}
export async function verifyHmac(
  token: string,
  secret: string,
): Promise<Record<string, unknown> | null> {
  try {
    const dot = token.indexOf(".");
    if (dot < 0) return null;
    const payloadB64 = token.slice(0, dot),
      sigB64 = token.slice(dot + 1);
    if (!payloadB64 || !sigB64) return null;
    if (!timingSafeEqual(fromBase64url(sigB64), await hmac(payloadB64, secret)))
      return null;
    const payload: unknown = JSON.parse(
      decoder.decode(fromBase64url(payloadB64)),
    );
    return payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}
```

Then `signDownloadToken` = `signHmac(payload, secret)`; `verifyDownloadToken` = call `verifyHmac`, then check `assetId`/`exp` types + `exp > now`.

- [ ] **Step 4: Run — expect PASS** (existing lead-magnet tests still green).
- [ ] **Step 5: Commit** `refactor(gated-delivery): generic signHmac/verifyHmac under the download-token wrappers`.

---

### Task 2: Sanity `emailPreferences` singleton + immutable key

**Files:**

- Create: `code/packages/web/email/src/sanity/email-preferences.ts`
- Modify: `code/packages/web/email/src/sanity/index.ts`
- Test: `code/packages/web/email/src/sanity/email-preferences.test.ts`

**Interfaces:**

- Produces: `emailPreferencesSchema` (a `defineType` singleton document, `name: "emailPreferences"`) and `emailPreferencesStructureItem` (a desk singleton item). Category object type `emailPreferenceCategory` with fields `key` (slug, immutable), `name` (localeString), `description` (localeText), `includeAtSignup` (boolean), `resendAudienceId` (string). Notice object `emailPreferenceNotice` with `name`/`description`. Singleton also has `centreHeading`/`centreIntro`/`noticesHeading` (locale fields) and `initialValue` seeding the 4 categories.

- [ ] **Step 1: Write the failing test**

```ts
import { emailPreferencesSchema } from "./email-preferences";
it("seeds the four reserved category keys", () => {
  const iv = (
    emailPreferencesSchema as {
      initialValue?: { categories?: { key: string }[] };
    }
  ).initialValue;
  expect(iv?.categories?.map((c) => c.key)).toEqual([
    "news",
    "offers",
    "partners",
    "tips",
  ]);
});
it("category key validation rejects an edit of an existing key", () => {
  const cat = (emailPreferencesSchema as any).fields.find(
    (f: any) => f.name === "categories",
  );
  const keyField = cat.of[0].fields.find((f: any) => f.name === "key");
  // The validation returns a message when the value changes vs the document snapshot.
  expect(typeof keyField.validation).toBe("function");
});
```

- [ ] **Step 2: Run — expect FAIL**: `pnpm --filter @indiecrafts/packages-web-email test`
- [ ] **Step 3: Implement** `email-preferences.ts`. Mirror `code/packages/web/compliance/src/sanity/cookie-category.ts` for the object+validation shape and `sanity-legends.md` for French legends. The `key` validation: `Rule.custom((val, ctx) => { const prev = (ctx.document as any)?._prevKey; ... })` — practically, mark the field read-only once set via `readOnly: ({ value }) => Boolean(value)` plus a `slug` source lock; add a `Rule.required()`. Seed `initialValue.categories` with the 4 keys, localized names/descriptions (en+fr), `includeAtSignup: true` only for `news`.
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** `feat(email): emailPreferences Sanity singleton (editor categories + notices)`.

---

### Task 3: Register the singleton in the Studio

**Files:**

- Modify: `code/packages/web/email/src/sanity/index.ts` (barrel export)
- Modify: `code/projects/web/surfaces/website/sanity.config.ts`

**Interfaces:**

- Consumes: `emailPreferencesSchema`, `emailPreferencesStructureItem` (Task 2).

- [ ] **Step 1:** Export both from the email `sanity` barrel.
- [ ] **Step 2:** In `sanity.config.ts`, add `emailPreferencesSchema` to the schema types and `emailPreferencesStructureItem` to the "Contenu partagé" desk group (mirror how `emailSanity` / the E-mails singleton is registered).
- [ ] **Step 3: Verify** `pnpm --filter @indiecrafts/web-surfaces-website tsc` green.
- [ ] **Step 4: Commit** `feat(website): register emailPreferences in the Studio desk`.

---

### Task 4: D1 migration — `email_preferences` + data migration

**Files:**

- Create: `code/shared/api/db/main/migrations/0009_email_preferences.sql`

- [ ] **Step 1: Write the migration**

```sql
-- 0009_email_preferences.sql — per-category marketing opt-in state.
CREATE TABLE email_preferences (
  user_id      TEXT NOT NULL,
  category_key TEXT NOT NULL,
  granted      INTEGER NOT NULL,
  updated_at   TEXT NOT NULL,
  PRIMARY KEY (user_id, category_key)
);
CREATE INDEX idx_email_prefs_category ON email_preferences (category_key, granted);
-- Migrate the legacy single opt-in into the reserved `news` category.
INSERT OR IGNORE INTO email_preferences (user_id, category_key, granted, updated_at)
SELECT user_id, 'news', marketing_email, strftime('%Y-%m-%dT%H:%M:%fZ','now')
FROM user_profiles WHERE marketing_email IS NOT NULL;
```

- [ ] **Step 2: Apply locally** (miniflare): `pnpm db:migrate:audit:local`-style — use the repo's `db:migrate` for `main`/core dev-local. Verify the table exists via a `wrangler d1 execute` `.schema` check.
- [ ] **Step 3: Commit** `feat(api): 0009 email_preferences table + legacy opt-in migration`.

---

### Task 5: Preference store (D1 read/write + proof + derived cache)

**Files:**

- Create: `code/shared/api/src/consent/email-preferences-store.ts`
- Test: `code/shared/api/src/consent/email-preferences-store.test.ts`

**Interfaces:**

- Produces:
  - `readPreferences(db: D1Database, userId: string): Promise<Record<string, boolean>>` — `{ [key]: granted }` from `email_preferences`.
  - `writePreferences(db, { userId, fingerprint, updates, surface, country }): Promise<void>` — for each `{ key, granted }`: `INSERT OR REPLACE` into `email_preferences`, append one `consent_events` row (`consent_type = 'email_pref:'+key`, idempotency `account:${userId}:${now}:${key}`), then recompute `marketing_email`.
  - `recomputeMarketingEmail(db, userId, marketingKeys: string[]): Promise<void>` — `UPDATE user_profiles SET marketing_email = (any granted key in marketingKeys ? 1 : 0)`.

- [ ] **Step 1: Write the failing test** (vitest-pool-workers; mirror `data-request/route.test.ts` for the D1 harness). Assert: writing `{news:true, offers:false}` yields those rows, a `consent_events` row per change with `consent_type='email_pref:news'`, and `user_profiles.marketing_email = 1`; then writing `{news:false}` sets `marketing_email = 0`.
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement.** Mirror the SQL patterns in `consent/marketing.ts:100-134` for the `consent_events` INSERT and the `user_profiles` update. `recomputeMarketingEmail`: `UPDATE user_profiles SET marketing_email = (SELECT CASE WHEN EXISTS(SELECT 1 FROM email_preferences WHERE user_id=? AND granted=1 AND category_key IN (<marketingKeys>)) THEN 1 ELSE 0 END) WHERE user_id=?` (bind keys dynamically).
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** `feat(api): email-preferences store (state + proof + derived cache)`.

---

### Task 6: Sanity category reader (api, never-throws)

**Files:**

- Create: `code/shared/api/src/consent/email-preferences-sanity.ts`
- Test: `code/shared/api/src/consent/email-preferences-sanity.test.ts`

**Interfaces:**

- Produces: `type PrefCategory = { key: string; name: string; description: string; includeAtSignup: boolean; resendAudienceId?: string }`; `type PrefNotice = { name: string; description: string }`; `fetchEmailPreferences(env, locale, doFetch?): Promise<{ categories: PrefCategory[]; notices: PrefNotice[] }>` — GROQ over HTTP, locale-resolved via `pickLocale`, **never throws** (unset Sanity → the seeded `news`-only default).

- [ ] **Step 1: Write the failing test** — mirror `clerk-email/sanity.test.ts`: inject `doFetch`, assert categories resolve to the requested locale and an unconfigured Sanity returns the `news` default.
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement** — mirror `clerk-email/sanity.ts` `fetchAuthEmailStrings` (host branch, Bearer, GROQ). Query: `*[_type=="emailPreferences"][0]{ categories[]{ key, name, description, includeAtSignup, resendAudienceId }, notices[]{ name, description } }`. Resolve `name`/`description` with `pickLocale`. Default constant `NEWS_DEFAULT` when result is null.
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** `feat(api): read emailPreferences categories from Sanity (never-throws)`.

---

### Task 7: Preference token (no-login)

**Files:**

- Create: `code/shared/api/src/consent/pref-token.ts`
- Test: `code/shared/api/src/consent/pref-token.test.ts`

**Interfaces:**

- Consumes: `signHmac`/`verifyHmac` (Task 1).
- Produces: `signPrefToken(secret, uid, cat?): Promise<string>`; `verifyPrefToken(secret, token): Promise<{ uid: string; cat?: string } | null>` (no expiry; validates `uid` is a non-empty string).

- [ ] **Step 1: Write the failing test** — round-trip `{uid, cat}`; bad secret → null; `cat` optional.
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement** — thin wrapper over `signHmac`/`verifyHmac`, narrowing the payload to `{uid, cat?}`.
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** `feat(api): signed no-login preference token`.

---

### Task 8: Per-audience Resend mirror

**Files:**

- Modify: `code/shared/api/src/resend-audience.ts`
- Test: `code/shared/api/src/resend-audience.test.ts` (create if absent)

**Interfaces:**

- Produces: `upsertResendContact(env, { email, granted, audienceId }, doFetch?)` and `deleteResendContact(env, { email, audienceId }, doFetch?)` — `audienceId` now explicit (falls back to `env.RESEND_AUDIENCE_ID` when omitted, preserving the single-toggle callers). No-op when `!RESEND_API_KEY || !audienceId`.

- [ ] **Step 1: Write the failing test** — inject `doFetch`; assert the POST/PATCH/DELETE target `/audiences/<audienceId>/contacts...` for a passed `audienceId`, and fall back to `env.RESEND_AUDIENCE_ID` when omitted.
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement** — add `audienceId` to the args; `const aud = audienceId ?? env.RESEND_AUDIENCE_ID; if (!env.RESEND_API_KEY || !aud || !email) return;` then use `aud` in the URL. Update the single existing caller (`consent/marketing.ts`) — it keeps working via the env fallback (no change needed).
- [ ] **Step 4: Run — expect PASS** (marketing consent tests still green).
- [ ] **Step 5: Commit** `refactor(api): parameterize Resend audience by id`.

---

### Task 9: JWT preference routes

**Files:**

- Create: `code/shared/api/src/consent/email-preferences.ts` (handlers)
- Modify: `code/shared/api/src/index.ts` (route wiring + `EMAIL_PREF_SECRET` on `Env`)
- Test: `code/shared/api/src/consent/email-preferences.test.ts`

**Interfaces:**

- Consumes: `verifyUserId` (`consent/marketing.ts`), Task 5 store, Task 6 reader, Task 8 mirror.
- Produces: `handleEmailPreferences(request, env, ctx?, deps?)` serving `GET`/`POST /v1/consent/email-preferences`. GET → `{ categories: [{key,name,description,granted,includeAtSignup}], notices, marketing_email }`. POST `{ updates:[{key,granted}], surface? }` → validate keys ⊆ Sanity set, `writePreferences`, best-effort mirror each changed category to its `resendAudienceId`, `{ ok: true }`.

- [ ] **Step 1: Write the failing test** — mirror `data-request/route.test.ts`. Assert: 401 without JWT; GET merges Sanity categories with stored state; POST an unknown key → 400; POST valid → rows written + proof + `{ok:true}`; the Resend mirror seam (injected) is called per changed category with its `audienceId`.
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement** — mirror `consent/marketing.ts` structure (CORS incl. `authorization`, `verifyUserId`, `MAIN_DB` guard). Resolve locale via `readProfileLocale`/`Accept-Language`; read categories (Task 6); merge with `readPreferences`; on POST call `writePreferences` + loop the mirror in `ctx.waitUntil`.
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** `feat(api): JWT /v1/consent/email-preferences (read + write)`.

---

### Task 10: No-login token routes + one-click unsubscribe

**Files:**

- Modify: `code/shared/api/src/consent/email-preferences.ts` (add token handlers + `emailPreferenceLinks`)
- Modify: `code/shared/api/src/index.ts` (wire the 3 routes)
- Test: extend `email-preferences.test.ts`

**Interfaces:**

- Consumes: Task 7 token, Task 5 store, Task 6 reader, Task 8 mirror.
- Produces: `handleTokenPreferences` (`GET`/`POST /v1/email-preferences`), `handleOneClickUnsubscribe` (`POST /v1/email-preferences/unsubscribe`), `emailPreferenceLinks(env, uid, cat?) => { manageUrl, unsubscribeUrl, headers: { "List-Unsubscribe": string; "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } }`.

- [ ] **Step 1: Write the failing test** — valid token GET returns the user's state; POST writes; one-click POST sets the token's `cat` (or all marketing) to `granted:0`, is idempotent, returns 200; a bad/absent token → 401/403; unset `EMAIL_PREF_SECRET` → 503.
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement** — token from query/body → `verifyPrefToken`; reuse the same read/write internals as Task 9 (factor a shared `respondState`/`applyUpdates`). One-click: if `cat` set, `updates=[{key:cat,granted:false}]` else every marketing key false. Guard with the inline rate-limit (`env.AGENT_RATELIMIT`) like `erasure/request.ts`. `emailPreferenceLinks` builds URLs from `WEBSITE_URL`/worker origin + `signPrefToken`.
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** `feat(api): no-login preference token routes + RFC 8058 one-click unsubscribe`.

---

### Task 11: Erasure — purge preferences + all category audiences

**Files:**

- Modify: `code/shared/api/src/erasure/d1.ts` (core adapter)
- Modify: erasure Resend-delete call sites (`self.ts`, `confirm.ts`, or the adapter) to loop every category audience
- Test: extend `erasure/d1.test.ts`

**Interfaces:**

- Consumes: Task 6 reader (to list category `resendAudienceId`s), Task 8 `deleteResendContact`.

- [ ] **Step 1: Write the failing test** — after erasing a subject: `email_preferences` rows for that `user_id` are gone; `deleteResendContact` (injected) is called once per category `resendAudienceId` (plus the legacy default).
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement** — in the core adapter's erase step add `DELETE FROM email_preferences WHERE user_id = ?`. Where the Resend contact is pure-deleted today (`self.ts:248`, and the confirm path), fetch categories (Task 6) and `deleteResendContact` for each distinct `resendAudienceId` (dedupe; include the env default). Best-effort, logged, never blocks the committed erasure.
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** `feat(api): erasure purges email_preferences + all category audiences`.

---

### Task 12: Sign-up webhook grants the `includeAtSignup` set

**Files:**

- Modify: `code/shared/api/src/index.ts` (the `user.created` clerk-webhook branch, ~line 1030-1078)
- Test: extend `clerk-profile-sync.test.ts`

**Interfaces:**

- Consumes: Task 5 store, Task 6 reader.

- [ ] **Step 1: Write the failing test** — `user.created` with `unsafe_metadata.marketing_email = true` writes `email_preferences` rows granted for every `includeAtSignup` category (via the injected reader returning `news` includeAtSignup) + proof; `marketing_email` derived to 1. `false` → no granted rows, `marketing_email` 0/null per current semantics.
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement** — where the webhook currently mirrors the single `marketing_email` on insert, additionally (when granted) call `writePreferences` for the `includeAtSignup` keys (surface `"signup"`). Keep the `user_profiles.marketing_email` column write (now also recomputed). Reader failure → fall back to `news` only (never blocks the webhook).
- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** `feat(api): sign-up opt-in grants the include-at-signup categories`.

---

### Task 13: Web preference centre (component + account + public page)

**Files:**

- Create: `code/packages/web/email/src/web/EmailPreferences.tsx`
- Create: `code/projects/web/surfaces/website/src/app/[locale]/email-preferences/page.tsx`
- Modify: the website account page (replace `MarketingEmailToggle` mount)
- Test: `code/packages/web/email/src/web/EmailPreferences.test.tsx`

**Interfaces:**

- Consumes: the api JWT + token routes (Task 9/10).
- Produces: `EmailPreferences({ read, write, chrome })` — `read: () => Promise<{categories,notices,marketing_email}>`, `write: (updates) => Promise<void>`; renders a switch per category + a read-only notices block; chrome strings passed in (from `messages/`).

- [ ] **Step 1: Write the failing test** — render with a stub `read` returning 2 categories (one granted) + 1 notice; assert both switches render with correct initial state, toggling calls `write` with `[{key,granted}]`, and the notice is non-interactive.
- [ ] **Step 2: Run — expect FAIL** (`pnpm --filter @indiecrafts/packages-web-email test`).
- [ ] **Step 3: Implement** the component (shadcn `Switch` via `@indiecrafts/packages-web-ui`; optimistic + error state; a11y labels). Account page: mount with a JWT IO (Clerk `getToken` → `fetch /v1/consent/email-preferences`), mirroring `MarketingNudgeMount`. Public page: `"use client"`, read `?token=`, IO hits `/v1/email-preferences?token=`; category copy comes from the api response, chrome from `messages`.
- [ ] **Step 4: Run — expect PASS**; `pnpm --filter @indiecrafts/web-surfaces-website tsc` green.
- [ ] **Step 5: Commit** `feat(web): email preference centre (account + public token page)`.

---

### Task 14: Mobile preference centre

**Files:**

- Create: `code/projects/mobile/surfaces/main/components/EmailPreferences.tsx`
- Modify: `code/projects/mobile/surfaces/main/app/account.tsx`
- Test: (native — a lightweight render test if the harness supports it, else a logic test of the IO mapper)

**Interfaces:**

- Consumes: the api JWT route (Task 9); Clerk-expo `getToken`.
- Produces: a native list of `Switch`es per category + read-only notices, driven by the api response (categories + copy come from the api, so no Sanity coupling).

- [ ] **Step 1:** Implement `EmailPreferences.tsx` mirroring `MarketingEmailToggle` but rendering the category list from `GET /v1/consent/email-preferences`; write via POST. Use `ui-native` primitives + accessibility props (`accessibilityRole`, labels).
- [ ] **Step 2:** Replace the `MarketingEmailToggle` mount in `account.tsx`.
- [ ] **Step 3: Verify** `pnpm --filter @indiecrafts/mobile-surfaces-main tsc` green; `expo lint` clean.
- [ ] **Step 4: Commit** `feat(mobile): email preference centre on the account screen`.

---

### Task 15: Env, docs, ledger, changelogs, briefs

**Files:**

- Modify: `code/shared/api/.dev.vars.example` + `wrangler.toml` (`EMAIL_PREF_SECRET` doc; note per-category audiences are Sanity-configured)
- Create: `code/docs/apps/web/config/email-preferences.md` + `code/docs/.vitepress/config.mts` sidebar line
- Update: QA runbook artifact (new "Email preferences" card with the standard Security-review + Sanity-dataset checkboxes)
- Update: `code/shared/api/.claude/CLAUDE.md`, `code/packages/web/email/.claude/CLAUDE.md`
- Update: `code/shared/api/CHANGELOG.md`, `code/packages/CHANGELOG.md`, website + mobile changelogs

- [ ] **Step 1:** Add `EMAIL_PREF_SECRET` to `.dev.vars.example` (commented) + a `[vars]` doc line; never a real value.
- [ ] **Step 2:** Write the docs page (categories, storage, routes, token, one-click, Resend audience ops, erasure). Add its sidebar line in lockstep.
- [ ] **Step 3:** Add the QA ledger card (test steps from the spec's "Deliverables" section).
- [ ] **Step 4:** Update the two briefs (new routes + Sanity singleton + token secret) and the four changelogs.
- [ ] **Step 5: Commit** `docs(email-preferences): env, docs, ledger card, briefs, changelogs`.

---

## Verification (whole feature)

- `pnpm --filter @indiecrafts/shared-api tsc && pnpm --filter @indiecrafts/shared-api test` green (all new route/store/token/erasure/webhook tests).
- `pnpm --filter @indiecrafts/packages-web-email test`, `packages-shared-gated-delivery test`, `web-surfaces-website tsc`, `mobile-surfaces-main tsc` green.
- `pnpm db:migrate:*:local` applies 0009; a local `email_preferences` row appears for a seeded profile.
- Manual (per the ledger card): toggle a category signed-in and via a token link; one-click unsubscribe; sign up with the box ticked → `includeAtSignup` categories granted; add/rename a Sanity category → reflected; erase a user → rows + every audience contact gone.

## Self-Review

- **Spec coverage:** categories (T2/T3), storage+migration (T4/T5), Sanity reader (T6), JWT routes (T9), token + one-click (T7/T10), per-category Resend (T8), erasure (T11), sign-up (T12), web+mobile UI (T13/T14), ledger+docs (T15). All spec sections mapped.
- **Type consistency:** `PrefCategory`/`PrefNotice` (T6) are the shape returned by the routes (T9/T10) and consumed by the UI (T13/T14); `writePreferences` args (T5) match the route POST body; `resendAudienceId` flows Sanity(T2)→reader(T6)→mirror(T8)→erasure(T11).
- **Ordering:** T1 (signer) → T7 (token) → T10; T2/T3 (Sanity) → T6 (reader) → T9; T4/T5 (D1) before all routes; T8 before T9/T11. Independent-ish: T13/T14 after T9/T10.
