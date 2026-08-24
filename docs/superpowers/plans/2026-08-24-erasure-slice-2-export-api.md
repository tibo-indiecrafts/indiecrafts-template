# Roadmap Slice 2: Export API (data portability) — `POST /v1/export` + R2 + surface controls

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Let a signed-in user export their own data (GDPR Art. 20). An authenticated worker route runs the existing `runExport`, stores the JSON bundle in R2, and hands back a short-lived single-use download link; a "Download my data" control sits beside the delete control in every surface's auth section.

**Architecture (locked):** Approach A — worker-gated R2 + hashed-token download (no S3 creds/deps). `POST /v1/export` (Clerk-JWT, mirrors `/v1/erasure/self`) → `runExport` → `EXPORT_BUCKET.put` → an `export_requests` D1 row (sha256 token hash + TTL + single-use) → returns a download URL. `GET /v1/export/download?token=` verifies the hashed token + TTL + single-use, streams the R2 object as an attachment, then deletes it. All four adapters already implement `export()`.

**Tech Stack:** Cloudflare Workers + R2 + D1 · `@cloudflare/vitest-pool-workers` · Clerk-JWT · React (web shadcn / native RN). **Map (exact paths/lines):** `.superpowers/sdd/slice-2-export-map.md`. **Mirror:** `code/shared/api/src/erasure/self.ts` (auth) + `confirm.ts`/`request.ts` (hashed-token/TTL) + `DeleteAccountSection` (surface control).

## Global Constraints

- **The download serves the user's PII.** Token: `sha256Hex`-hashed in D1 (never plaintext stored), short TTL (default 1h), single-use; delete the R2 object on download. The plaintext token travels only in the authenticated POST response (TLS) to the user who just proved identity — so the GET download is token-gated (no cookie/CORS dependency), same model as the erasure confirm link.
- **Reuse, don't reinvent:** the `self.ts` auth pipeline verbatim (secret preflight → body cap → `AGENT_RATELIMIT` by IP → `defaultAuthenticate` Clerk-JWT → injectable `buildAdapters`/`authenticate` seams); `sha256Hex` + the hashed-token/TTL pattern from `confirm.ts`; `DeleteAccountSection` for the surface control (Clerk-agnostic, props-driven).
- **No new secrets/deps** (Approach A). New binding only: `EXPORT_BUCKET` (R2), operator-provisioned (bucket doesn't exist yet — the code ships; the operator creates it, like every other binding). Routes fail-safe 503 when `EXPORT_BUCKET`/`DB`/`CLERK_SECRET_KEY` unset.
- **Config-first / worker-safety / commit `--no-verify` / stage-only-named-files / prettier / writing-style** — same as every prior slice. The shared component never imports `@clerk/*`/`next`.

---

### Task 1: Worker — `POST /v1/export` + `GET /v1/export/download` + R2

**Files:** migration `code/shared/api/db/d1/migrations/0005_export_requests.sql`; `code/shared/api/src/export/route.ts` (+ `route.test.ts`); modify `code/shared/api/src/index.ts` (Env `EXPORT_BUCKET` + dispatch) + `wrangler.toml` (uncomment/add the `[[r2_buckets]]` block) + api `CHANGELOG.md` + `.claude/CLAUDE.md` + `code/docs/apps/web/config/data-retention.md`.

**Interfaces:**
- Produces: `handleExport(request, env, ctx?, buildAdapters?, authenticate?)` (POST) and `handleExportDownload(request, env, token)` (GET). `Env.EXPORT_BUCKET?: R2Bucket`.

- [ ] **Step 1: Migration.** `0005_export_requests.sql` — mirror `0004_erasure_requests.sql`: `id PK AUTOINCREMENT, token_hash TEXT NOT NULL, r2_key TEXT NOT NULL, user_id TEXT, email_fingerprint TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL, downloaded_at TEXT` + index on `token_hash`. Forward-only.
- [ ] **Step 2: Failing tests** (`route.test.ts`, mirror `self.test.ts` — injected `authenticate`/`buildAdapters`, real D1; add an `r2Buckets` entry to the pool config if needed — see map §6): (a) authed POST → runs export, puts an R2 object, inserts a row, returns `{ downloadUrl }` containing a token; (b) GET download with the returned token → 200 + the bundle bytes + `content-disposition: attachment`, and the row's `downloaded_at` set + a second GET → 400 (single-use); (c) expired TTL → 400; (d) bad/absent JWT on POST → 401; (e) missing `CLERK_SECRET_KEY`/`EXPORT_BUCKET` → 503.
- [ ] **Step 3: Implement `route.ts`.**
  - `handleExport`: mirror `handleErasureSelf` up through auth (OPTIONS/405, `!DB||!GDPR_FINGERPRINT_SALT` 503, `buildAdapters===defaultAdapters && (!CLERK_SECRET_KEY||!EXPORT_BUCKET||Sanity secrets)` 503, body cap, rate-limit by IP, `authenticate`). Then: `const bundle = await runExport(adapters, authed.email); const stamped = { ...bundle, ts: new Date().toISOString() };` (runExport returns `ts:""` — stamp it). `const r2Key = "export/" + crypto.randomUUID() + ".json"; await env.EXPORT_BUCKET.put(r2Key, JSON.stringify(stamped), { httpMetadata: { contentType: "application/json" } });` a plaintext `token = crypto.randomUUID()`; insert `export_requests` (token_hash=`await sha256Hex(token)`, r2_key, user_id, email_fingerprint=`fingerprintEmail(authed.email)`, created_at=now, expires_at=now+1h). Best-effort admin_audit `export.self`. Return `json({ downloadUrl: \`${env.WEBSITE_URL ?? new URL(request.url).origin}/v1/export/download?token=${token}\` }, 200, PUBLIC_CORS_POST)`. (Keep the download URL on the worker origin — it streams from the worker; `WEBSITE_URL` only matters if a branded page is added later. For this slice use the worker origin: `${new URL(request.url).origin}/v1/export/download?token=${token}`.)
  - `handleExportDownload(request, env, token)`: GET only; `!token` → 404 (guard before hashing — `sha256Hex` throws on ""); `!env.DB || !env.EXPORT_BUCKET` → 503; look up `export_requests WHERE token_hash = sha256Hex(token)`; no row / `downloaded_at` not null / `now > expires_at` → 400 `{error:"invalid"}`; else mark `downloaded_at=now` (single-use), `const obj = await env.EXPORT_BUCKET.get(row.r2_key);` if null → 410; stream `obj.body` with `content-type: application/json` + `content-disposition: attachment; filename="my-data-export.json"`; `ctx.waitUntil(env.EXPORT_BUCKET.delete(row.r2_key))` (delete-on-download). PUBLIC CORS (GET).
- [ ] **Step 4: Wire `index.ts`** — `Env.EXPORT_BUCKET?: R2Bucket;`; import + dispatch `if (url.pathname === "/v1/export") return handleExport(request, env, ctx);` and `if (url.pathname.startsWith("/v1/export/download")) { const token = new URL(request.url).searchParams.get("token") ?? ""; return handleExportDownload(request, env, token); }`. In `wrangler.toml`, add/uncomment `[[r2_buckets]] binding = "EXPORT_BUCKET" bucket_name = "..."` (commented example bucket name, per the map — operator provisions).
- [ ] **Step 5: Verify + docs + commit.** `pnpm --filter @indiecrafts/shared-api test` (all green incl. new) + `tsc` 0. api CHANGELOG + brief (`POST /v1/export` + `GET /v1/export/download` + `EXPORT_BUCKET`); data-retention.md (the export flow + the 1h single-use download + delete-on-download). Prettier. Commit `--no-verify`.

---

### Task 2: Shared `ExportSection` + helper

**Files:** `code/packages/shared/compliance/src/shared/export-self.ts` (+ `.test.ts`); `code/packages/shared/compliance/src/web/ExportSection.tsx`; `code/packages/shared/compliance/src/native/ExportSection.tsx`; modify `src/web/index.ts` + `src/native/index.ts` barrels.

**Interfaces:**
- Produces: `requestExport(input: { apiUrl; getToken }): Promise<{ ok: true; url: string } | { ok: false }>`; `ExportSection` (web + native) with `{ copy: ExportCopy; apiUrl; getToken; onExported?(url) }`.

- [ ] **Step 1: Helper + failing test.** `export-self.ts`: `requestExport` POSTs `${apiUrl}/v1/export` with `Authorization: Bearer <getToken()>` (no body needed), 200 → `{ ok: true, url: (await res.json()).downloadUrl }`, else → `{ ok: false }`. `.test.ts` (vitest): stub fetch; 200→url, 401/500/throw→{ok:false}; assert the bearer header + URL.
- [ ] **Step 2: Components.** `ExportSection.tsx` (web, `"use client"`) + native — mirror `DeleteAccountSection` structure (copy-as-props, `role="status"`, ui-native primitives for native). A "Download my data" button → `requestExport` → on `{ok,url}` open the download (web: `window.open(url, "_blank")` — or an `<a href download>`; native: `import { Linking } from "react-native"; Linking.openURL(url)`) + call `onExported?.(url)`; show pending/success/error copy. `ExportCopy = { heading, body, button, pending, success, error }`. Barrel-export both + the types + `requestExport` from the matching `index.ts` (web exports web component + shared helper re-export; native exports native component).
- [ ] **Step 3: Verify + commit.** `pnpm --filter @indiecrafts/packages-shared-compliance test` (helper cases green). Prettier. Commit `--no-verify`.

---

### Task 3: Web mounts (website + app)

**Files:** website + app: modify each `src/user-interface/account/AccountDeletePanel.tsx` (or a sibling panel) to also render `<ExportSection>`; each `messages/{en,fr}.json` (`account.export.*`); each `features` (website `features.account.export`, app flat `exportAccount`? — match each surface's flag style from Slice B); docs.

- [ ] **Step 1:** Add `account.export.*` i18n (heading, body, button, pending, success, error) to website + app messages (en/fr parity). Add the flag (website: `features.account.export` under the `account` group; app: a key on the flat `features` literal).
- [ ] **Step 2:** Render `<ExportSection copy={exportCopy} apiUrl={...} getToken={() => getToken()} />` beside the existing `<DeleteAccountSection>` in each surface's account panel (resolve `exportCopy` server-side in the page, pass as a prop — mirror the delete copy plumbing). Gate on the export flag; the page's existing `NEXT_PUBLIC_API_URL` gate already covers it.
- [ ] **Step 3:** Verify each surface `tsc` + `test`; docs (website CHANGELOG + feature-flags.md; app CHANGELOG). Prettier. Commit `--no-verify` per surface (or one commit).

---

### Task 4: Native mounts (hybrid + mobile)

**Files:** hybrid `src/renderer/src/auth.tsx` (SignedInView) + mobile `app/sign-in.tsx` (SignedInView); each surface's messages + flag + CHANGELOG.

- [ ] **Step 1:** Add `account.export.*` (react-intl keys) to hybrid + mobile messages (en/fr parity); add the `exportAccount`/`export` flag to each flat `features` literal.
- [ ] **Step 2:** Render the native `<ExportSection>` beside the delete control in each `SignedInView`, gated by the flag + `apiUrl`; build copy via `useIntl().formatMessage`; `getToken` from the existing `useAuth()`.
- [ ] **Step 3:** Verify hybrid + mobile `tsc` (+ mobile jest); CHANGELOGs. Prettier. Commit `--no-verify`.

---

## Self-review
- Coverage: worker route + R2 + single-use hashed-token download (T1), shared component + helper (T2), all-4-surface mounts (T3+T4). Matches the locked design (R2 + link, all 4 surfaces).
- Security: PII download is hashed-token + TTL + single-use + delete-on-download; POST is Clerk-JWT-authed; fail-safe 503s. Mirrors the erasure token spine.
- Deferred (note): orphaned (never-downloaded) R2 bundles — cleaned by the SLA cron slice (Slice 3) purging expired `export_requests` + their R2 objects; for now delete-on-download + the 1h TTL bound exposure. An R2 lifecycle rule is the operator's alternative.
- **Ruling S2-APPROACH:** Approach A (worker-gated R2 + hashed token), per the map — no S3 creds/deps, reuses the hardened erasure-token pattern. Cost if wrong: swap to S3 presigned (add aws4fetch + R2 creds) later; the surface + route contract are unaffected.
- **Ruling S2-OPERATOR:** ships the code + a commented `[[r2_buckets]]` example; the operator provisions the bucket + sets `bucket_name` (template convention). Routes 503 until bound.
