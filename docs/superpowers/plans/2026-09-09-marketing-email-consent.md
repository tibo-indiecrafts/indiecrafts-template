# Commercial-email consent (`marketing_email`) — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture an unchecked marketing-email opt-in at sign-up (website · app · mobile · hybrid), nudge existing users once after sign-in, edit it in account settings, store proof + current state, mirror to a Resend audience, and show status in the admin users list. Capture-only — nothing sends.

**Architecture:** Current state on a new `user_profiles.marketing_email` column; immutable proof in the existing `consent_events`. Sign-up flows carry the choice in Clerk `unsafeMetadata`; the `user.created` webhook mirrors it + writes the proof + syncs Resend. Settings + the sign-in nudge use a new Clerk-JWT `GET/POST /v1/consent/marketing-email`. The admin list reads a bearer-gated batch endpoint. Erasure pure-deletes the Resend contact.

**Tech Stack:** Cloudflare Workers (bare, api) · D1 · TypeScript · Next 16 (website/app/admin) · Expo (mobile) · Electron/clerk-react (hybrid) · Resend · vitest.

**Spec:** `docs/superpowers/specs/2026-09-09-marketing-email-consent-design.md`

## Global Constraints

- **Opt-in unchecked by default** everywhere; stored default = `NULL` ("no decision"), never granted.
- **Never commit `.env*`** (only `.env.example`); never expose a non-public token under `NEXT_PUBLIC_`/`EXPO_PUBLIC_`/`VITE_`.
- **`consent_events` is append-only** — never updated in place. Never store raw email there (keep `email_fingerprint`).
- Read from `@/config`, route via `@/i18n/routing`, user-facing strings in `messages/<locale>.json`.
- Admin surface is **excluded** from capture UI (no end-user sign-up/account there); it only _reads_ the flag (Task 13).
- Commit each task. Commit messages end with the session attribution footer.

## API contract (produced by the api tasks, consumed by the surface tasks)

- `POST /v1/clerk-webhook` (`user.created`) — mirrors `unsafe_metadata.marketing_email` → column + proof + Resend (Task 3).
- `GET /v1/consent/marketing-email` (Clerk JWT) → `{ marketing_email: boolean | null }` for the caller (Task 5).
- `POST /v1/consent/marketing-email` (Clerk JWT) — body `{ granted: boolean, surface: string }` → writes proof + column + Resend for the caller; returns `{ ok: true }` (Task 5).
- `POST /v1/profiles/consent` (bearer) — body `{ userIds: string[] }` → `{ [userId]: 0 | 1 | null }` (Task 6).
- `RESEND_AUDIENCE_ID` env; unset → Resend sync no-ops (Task 2, 8).

`unsafeMetadata` at sign-up = `{ locale?: string, marketing_email?: boolean }`.

---

### Task 1: Migration — `user_profiles.marketing_email`

**Files:**

- Create: `code/shared/api/db/main/migrations/0008_user_profiles_marketing_email.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Marketing-email opt-in (current state; the append-only proof stays in consent_events).
-- Forward-only (D1 has no down-migration). NULL = never decided, 0 = opted out, 1 = opted in.
-- Written on user.created (from Clerk unsafe_metadata) and by POST /v1/consent/marketing-email.
ALTER TABLE user_profiles ADD COLUMN marketing_email INTEGER;
```

- [ ] **Step 2: Apply to the local + remote dev DB**

Run: `pnpm db:migrate:audit:local` equivalent for main — use the repo's migrate runner for the `main`/MAIN_DB binding, `--env dev --remote` for the real dev DB. Confirm with:
`wrangler d1 execute indiecrafts-dev-db-main --env dev --remote --command "SELECT marketing_email FROM user_profiles LIMIT 1"` → no error (column exists).

- [ ] **Step 3: Commit** — `feat(api): add user_profiles.marketing_email column`

---

### Task 2: Resend audience module + tests

**Files:**

- Create: `code/shared/api/src/resend-audience.ts`
- Test: `code/shared/api/src/resend-audience.test.ts`

**Interfaces (Produces):**

- `type ResendAudienceEnv = { RESEND_API_KEY?: string; RESEND_AUDIENCE_ID?: string }`
- `upsertResendContact(env, { email, granted }, doFetch?): Promise<void>`
- `deleteResendContact(env, { email }, doFetch?): Promise<void>`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it, vi } from "vitest";
import { upsertResendContact, deleteResendContact } from "./resend-audience";

const env = { RESEND_API_KEY: "k", RESEND_AUDIENCE_ID: "aud_1" };

describe("resend-audience", () => {
  it("no-ops when RESEND_AUDIENCE_ID is unset", async () => {
    const f = vi.fn();
    await upsertResendContact(
      { RESEND_API_KEY: "k" },
      { email: "u@x.com", granted: true },
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
  });
  it("creates/updates a contact with unsubscribed = !granted", async () => {
    const calls: Array<{ url: string; body: unknown }> = [];
    const f = vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      return new Response("{}", { status: 200 });
    });
    await upsertResendContact(
      env,
      { email: "u@x.com", granted: false },
      f as unknown as typeof fetch,
    );
    expect(calls[0].url).toContain("/audiences/aud_1/contacts");
    expect(calls[0].body).toMatchObject({
      email: "u@x.com",
      unsubscribed: true,
    });
  });
  it("deletes a contact by email", async () => {
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    await deleteResendContact(
      env,
      { email: "u@x.com" },
      f as unknown as typeof fetch,
    );
    const [url, init] = f.mock.calls[0];
    expect(String(url)).toContain("/audiences/aud_1/contacts/u@x.com");
    expect((init as RequestInit).method).toBe("DELETE");
  });
});
```

- [ ] **Step 2: Run — verify fail.** `pnpm --filter @indiecrafts/shared-api test resend-audience`

- [ ] **Step 3: Implement.** Mirror `erasure/email.ts` (env slice, inline `fetch`, injectable seam). Upsert = `POST /audiences/{id}/contacts` with `{ email, unsubscribed: !granted }`; on a 409/existing response, `PATCH /audiences/{id}/contacts/{email}` with `{ unsubscribed: !granted }`. Delete = `DELETE /audiences/{id}/contacts/{email}`. All guard `if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) return;`. Non-2xx (except the upsert 409 fallback) → `throw new Error(\`resend ${status}\`)` so the caller can log; caller wraps best-effort.

- [ ] **Step 4: Run — verify pass.**

- [ ] **Step 5: Commit** — `feat(api): resend audience contact upsert/delete`

---

### Task 3: Webhook mirror + sign-up proof + Resend sync

**Files:**

- Modify: `code/shared/api/src/index.ts` (the `user.created`/`updated` upsert, ~975-1001) + Env type (add `RESEND_AUDIENCE_ID`)
- Test: `code/shared/api/src/clerk-profile-sync.test.ts` (extend)

**Interfaces (Consumes):** `upsertResendContact` (Task 2), the `marketing_email` column (Task 1).

- [ ] **Step 1: Write failing test** — a `user.created` event with `unsafe_metadata: { marketing_email: true }` sets `user_profiles.marketing_email = 1`, inserts a `consent_events` row (`consent_type:"marketing_email"`, `granted:1`, `source:"signup"`), and calls the Resend upsert. A `user.updated` with `marketing_email: false` does **not** change the stored column. Use the existing test's D1 + injected seams (add a `syncResend` injectable param to the sync path, defaulting to `upsertResendContact`).

- [ ] **Step 2: Run — verify fail.**

- [ ] **Step 3: Implement.**
  - Read + validate: `const rawMkt = (data.unsafe_metadata as { marketing_email?: unknown })?.marketing_email; const marketingEmail = typeof rawMkt === "boolean" ? (rawMkt ? 1 : 0) : null;`
  - Add `marketing_email` to the INSERT column list + VALUES; **omit it from the `ON CONFLICT DO UPDATE SET`** clause (never clobber on update).
  - After the upsert, on `user.created` with `marketingEmail !== null`: `INSERT OR IGNORE INTO consent_events (...) VALUES (...)` with `subject_type:"user"`, `subject_id:userId`, `email_fingerprint:fingerprint`, `consent_type:"marketing_email"`, `granted:marketingEmail`, `policy_version:"1"`, `surface:str((data.unsafe_metadata as {...}).consent_surface) || "signup"`, `source:"signup"`, `country:null`, `ip_hash:null`, `idempotency_key:\`signup:${userId}:marketing_email\``.
  - Best-effort Resend: `if (marketingEmail !== null && email) { try { await syncResend(env, { email, granted: marketingEmail === 1 }); } catch (e) { logger.error("resend sync failed", { where: "signup", error: (e as Error)?.name }); } }`
  - Add `RESEND_AUDIENCE_ID?: string` to the api `Env` type.

- [ ] **Step 4: Run — verify pass.** Then `pnpm --filter @indiecrafts/shared-api test`.

- [ ] **Step 5: Commit** — `feat(api): mirror marketing_email opt-in at sign-up (column + proof + resend)`

---

### Task 4: (dropped) — settings/nudge writes go through Task 5's Clerk-JWT endpoint, not `/v1/events`. No change to `/v1/events`.

---

### Task 5: `GET`/`POST /v1/consent/marketing-email` (Clerk JWT)

**Files:**

- Create: `code/shared/api/src/consent/marketing.ts` — `handleGetMarketing(env, userId)`, `handlePostMarketing(env, userId, body)`
- Modify: `code/shared/api/src/index.ts` — route + Clerk-JWT verification (reuse the `/v1/export` verifier)
- Test: `code/shared/api/src/consent/marketing.test.ts`

**Interfaces (Produces):**

- `GET` → `{ marketing_email: boolean | null }`
- `POST { granted: boolean, surface: string }` → writes proof (`source:"account"`) + `UPDATE user_profiles SET marketing_email` + Resend sync (email from `user_profiles.email`); `{ ok: true }`.

- [ ] **Step 1: Write failing tests** — GET returns the stored value mapped to boolean/null; POST(granted:true) inserts a `marketing_email` proof row, sets the column to 1, resolves email from `user_profiles`, and calls Resend upsert; POST(granted:false) sets 0 + Resend unsubscribe. Inject the Resend seam + a stub D1.

- [ ] **Step 2: Run — verify fail.**

- [ ] **Step 3: Implement.**
  - `handleGetMarketing`: `SELECT marketing_email FROM user_profiles WHERE user_id = ?` → `{ marketing_email: row?.marketing_email == null ? null : row.marketing_email === 1 }`.
  - `handlePostMarketing`: validate `granted` boolean + `surface` string; `SELECT email FROM user_profiles WHERE user_id = ?`; `INSERT OR IGNORE INTO consent_events (...)` (`source:"account"`, `idempotency_key:\`account:${userId}:${Date.now()}:marketing_email\``); `UPDATE user_profiles SET marketing_email = ? WHERE user_id = ?`; best-effort `upsertResendContact(env, { email, granted })`with try/catch +`logger.error`.
  - In `index.ts`, add `if (url.pathname === "/v1/consent/marketing-email")`: verify the Clerk JWT exactly like `/v1/export` (extract `userId` from the verified claims; 401 on failure), branch on method → the two handlers.

- [ ] **Step 4: Run — verify pass.**

- [ ] **Step 5: Commit** — `feat(api): GET/POST /v1/consent/marketing-email (authenticated)`

---

### Task 6: `POST /v1/profiles/consent` (bearer, batch) for admin

**Files:**

- Modify: `code/shared/api/src/index.ts` — new bearer-gated route
- Test: `code/shared/api/src/index` sibling test or `consent/marketing.test.ts`

- [ ] **Step 1: Write failing test** — bearer-gated; body `{ userIds: ["u1","u2"] }` → `{ u1: 1, u2: null }` from `user_profiles`. Missing/invalid bearer → 401. Empty/oversized `userIds` → 400.

- [ ] **Step 2: Run — verify fail.**

- [ ] **Step 3: Implement.** Reuse the existing bearer guard used by the other `/v1` bearer routes. Cap `userIds` at 100. `SELECT user_id, marketing_email FROM user_profiles WHERE user_id IN (...)` (parameterized placeholders); build the map, defaulting unknown ids to `null`.

- [ ] **Step 4: Run — verify pass.**

- [ ] **Step 5: Commit** — `feat(api): POST /v1/profiles/consent batch read`

---

### Task 7: Erasure — pure-delete the Resend contact

**Files:**

- Read first: `code/shared/api/src/erasure/self.ts`, `code/shared/api/src/erasure/clerk-deleted.ts` (find where the email is available before pseudonymization)
- Modify: those two entry points
- Test: extend their colocated tests

- [ ] **Step 1: Write failing test** — a self-service erasure and a `user.deleted` webhook each call `deleteResendContact` with the subject email (best-effort; a Resend failure does not fail the erasure).

- [ ] **Step 2: Run — verify fail.**

- [ ] **Step 3: Implement.** In each entry point, after resolving the subject email (self: the typed email; clerk-deleted: the payload email) and before/around the erasure run, best-effort `try { await deleteResendContact(env, { email }); } catch (e) { logger.error("resend erasure delete failed", { error: (e as Error)?.name }); }`. Add a `ponytail:`/compliance comment: pure delete, no win-back audience — deliberate. Inject the seam for tests.

- [ ] **Step 4: Run — verify pass.** Then full api suite.

- [ ] **Step 5: Commit** — `feat(api): delete the resend contact on erasure`

---

### Task 8: api env wiring — `RESEND_AUDIENCE_ID`

**Files:**

- Modify: `code/shared/api/wrangler.toml` (a `[vars]` entry per env, empty/placeholder) + `code/shared/api/.dev.vars.example`
- Modify: `code/shared/api/.claude/CLAUDE.md` (mention the var)

- [ ] **Step 1:** Add `RESEND_AUDIENCE_ID` to `.dev.vars.example` (commented, no value) and document it as optional (unset → Resend sync off). Do **not** commit any real id/secret. Note in the brief that `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` enable the audience mirror.

- [ ] **Step 2: Commit** — `chore(api): document RESEND_AUDIENCE_ID`

---

### Task 9: Web sign-up checkbox (website + app)

**Files:**

- Modify: `code/packages/web/auth/src/sign-up-view.tsx` — checkbox above `<SignUp>`, its state → `unsafeMetadata`
- Modify: `code/projects/web/surfaces/website/src/app/[locale]/sign-up/[[...sign-up]]/page.tsx` + app equivalent — pass a localized label
- Modify: `website` + `app` `messages/<locale>.json` — `auth.marketingOptIn` copy

**Interfaces (Consumes):** the `unsafeMetadata.marketing_email` contract.

- [ ] **Step 1:** Make `SignUpView` a client component with an unchecked `useState(false)`; render a checkbox + label above the `<SignUp>` card (shadcn `Checkbox` + `Label` from `@indiecrafts/packages-web-ui`); feed `unsafeMetadata={{ ...(locale ? { locale } : {}), marketing_email: optIn }}`. Add a `marketingLabel?: string` prop; the page passes `t("auth.marketingOptIn")`.

- [ ] **Step 2:** Add the copy to both surfaces' `messages/en.json` + `fr.json` (unchecked, plain: "Send me occasional product news and offers. You can unsubscribe anytime.").

- [ ] **Step 3:** `pnpm --filter @indiecrafts/web-surfaces-website tsc` + app tsc green.

- [ ] **Step 4: Commit** — `feat(web): marketing-email opt-in checkbox at sign-up`

---

### Task 10: Mobile + hybrid sign-up checkbox

**Files:**

- Modify: `code/projects/mobile/surfaces/main/app/sign-in.tsx` (~the `signUp.create` call) + mobile messages
- Modify: `code/projects/hybrid/surfaces/main/src/renderer/src/auth.tsx` (the `<SignUp>` branch) + hybrid en/fr messages

- [ ] **Step 1: Mobile** — add an unchecked native checkbox/switch to the sign-up form; pass `unsafeMetadata: { locale: t.locale, marketing_email }` into `signUp.create`.

- [ ] **Step 2: Hybrid** — add an unchecked checkbox above/within the `<SignUp>`; feed `unsafeMetadata={{ locale, marketing_email }}`. Add the label to hybrid en/fr message maps.

- [ ] **Step 3:** mobile tsc + hybrid tsc/test green.

- [ ] **Step 4: Commit** — `feat(mobile,hybrid): marketing-email opt-in at sign-up`

---

### Task 11: Sign-in nudge (shared component + mounts)

**Files:**

- Create: `code/packages/shared/compliance/src/web/MarketingNudge.tsx` + `native/MarketingNudge.tsx`
- Modify: the compliance `./web` / `./native` barrels
- Modify: web `[locale]/layout.tsx` (website + app) to mount it for signed-in users; mobile/hybrid mount points
- Modify: each surface's messages — nudge copy (title, yes, no)

**Interfaces (Consumes):** `GET`/`POST /v1/consent/marketing-email` (Task 5), `getToken` seam.

- [ ] **Step 1:** Build `MarketingNudge({ apiUrl, getToken, copy, snoozeKey })`: on mount, `GET /v1/consent/marketing-email` with the token; if `marketing_email === null` and no `localStorage[snoozeKey]`, render a dismissable banner. `[Yes]`/`[No thanks]` → `POST { granted, surface }` then hide. `[×]` → set `localStorage[snoozeKey]` + hide. Copy + `getToken` + `apiUrl` injected (brick stays `@clerk`-free); wrap `localStorage` in try/catch.

- [ ] **Step 2:** Mount on each surface for signed-in users (web: in the layout beside the cookie banner, `snoozeKey = \`${site.prefix}.mkt-nudge-snooze\``, `getToken` from the surface's Clerk SDK). Add copy to messages.

- [ ] **Step 3:** tsc/test green per surface.

- [ ] **Step 4: Commit** — `feat: one-time sign-in marketing nudge`

---

### Task 12: Account settings toggle

**Files:**

- Create: `code/packages/shared/compliance/src/web/MarketingEmailToggle.tsx` (+ native if the native account screen supports it)
- Modify: the account modal wiring (`AccountControl.tsx` on website/app; the shared account modal) to include the toggle in the consent tab
- Modify: each surface's messages — toggle label + saved toast

**Interfaces (Consumes):** `GET`/`POST /v1/consent/marketing-email`, `getToken`.

- [ ] **Step 1:** `MarketingEmailToggle({ apiUrl, getToken, label, onSaved })`: `GET` the current value on mount → toggle state (loading skeleton until resolved); on change → `POST { granted, surface }` → `onSaved()`. Add it to the account modal's consent tab (below the cookie categories), server-backed.

- [ ] **Step 2:** Wire `getToken` from each surface's Clerk SDK into the account control; add copy.

- [ ] **Step 3:** tsc/test green.

- [ ] **Step 4: Commit** — `feat: editable commercial-email toggle in account settings`

---

### Task 13: Admin users-list "Emails" column

**Files:**

- Modify: `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/users/page.tsx`
- Modify: admin `messages/<locale>.json` (`admin.users.emails` + values) + `code/projects/web/surfaces/admin/.env.example` (`API_URL`, `APP_API_TOKEN`)

- [ ] **Step 1:** After `fetchUsers`, if `API_URL` + `APP_API_TOKEN` are set, `POST /v1/profiles/consent` with the fetched ids; merge `marketing_email` into each row. Add a new `<TableHead>{t("emails")}</TableHead>` + cell rendering ✓ (1) / ✗ (0) / — (null) with a non-color cue (icon+text, per a11y). On fetch failure → all `—` (fail-open, no crash).

- [ ] **Step 2:** Add the message keys + the two `.env.example` vars (no real values).

- [ ] **Step 3:** admin tsc green.

- [ ] **Step 4: Commit** — `feat(admin): show marketing-email status in the users list`

---

### Task 14: Docs + changelog

**Files:**

- Modify: `code/docs/shared/architecture/auth.md` (or a compliance doc) — a "Commercial-email consent" section (the stores, capture points, Resend, erasure pure-delete) + the `code/docs/.vitepress/config.mts` sidebar if a new page is added
- Modify: `code/shared/api/.claude/CLAUDE.md` — the new routes + `RESEND_AUDIENCE_ID`
- Modify: `code/shared/api/CHANGELOG.md` — a plain-language entry

- [ ] **Step 1:** Write the docs (writing-style: active voice, exact identifiers). State the unchecked-default + pure-delete-on-erasure decisions.

- [ ] **Step 2: Commit** — `docs: commercial-email consent`

---

### Task 15: QA Runbook ledger card

**Files:**

- Modify: the QA Runbook artifact scratchpad file, then republish the same path (keeps the URL).

- [ ] **Step 1:** Add a new `<section class="feat">` card "Commercial-email consent" with steps: unchecked default at sign-up per surface; opt-in stored (`wrangler d1 execute … SELECT user_id, marketing_email FROM user_profiles`); the `consent_events` proof row; the sign-in nudge for a NULL-flag user (Yes/No records, × snoozes); the settings toggle round-trip; Resend contact present+subscribed on opt-in, unsubscribed on opt-out, **gone after erasure**; the admin "Emails" column; capture-only (nothing sends); + the standard admin-link checkbox.

- [ ] **Step 2:** Republish the artifact to the same URL.

## Self-review (done)

- **Spec coverage:** every spec section maps to a task (stores→T1; sign-up→T3/T9/T10; nudge→T5/T11; settings→T5/T12; Resend→T2/T3/T5/T7; admin→T6/T13; docs→T14; QA→T15). The spec's "/v1/events extension" is **superseded** by the Task 5 Clerk-JWT endpoint — sync the spec's API section.
- **Placeholder scan:** none.
- **Type consistency:** `unsafeMetadata.marketing_email: boolean`; column `INTEGER` NULL/0/1; API booleans/null at the edge; `upsertResendContact`/`deleteResendContact` names stable across T2/T3/T5/T7.

## Execution order

T1 → T2 → T3 → T5 → T6 → T7 → T8 (backend, TDD, independently testable) → T9 → T10 → T11 → T12 (surfaces, consume the contract) → T13 (admin read) → T14 (docs) → T15 (QA card).
