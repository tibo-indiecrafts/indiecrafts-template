# Erasure UI — Slice C: website anonymous branded email-token flow

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Branded, i18n `/erasure` (request) + `/erasure/confirm` (confirm) pages on the website for signed-out visitors, driving the existing public worker erasure routes end-to-end — with the emailed link opening the branded confirm page.

**Architecture:** A one-line, backward-compatible worker tweak points the emailed confirm URL at the website (`WEBSITE_URL` env, fallback to the worker origin). Two website-local server pages resolve copy + fail-safe-gate, each rendering a `"use client"` form that POSTs directly to the worker via a small pure helper (request = FormData + Turnstile; confirm = JSON). A note on the DSAR page cross-links to `/erasure`.

**Tech Stack:** Next.js 16 · React 19 · next-intl · Tailwind v4 · shadcn (`@indiecrafts/packages-web-ui-components` `TurnstileWidget`) · the Phase-4a worker routes.

**Spec:** `docs/superpowers/specs/2026-08-23-self-service-erasure-ui-design.md` (Section 3). **Integration map (exact paths/lines):** `.superpowers/sdd/slice-c-website-erasure-map.md`. **Pattern to mirror:** Slice B's `/account` page + `AccountDeletePanel`.

## Global Constraints

- **Worker routes (Phase 4a, already live):**
  - `POST /v1/erasure/request` — reads **FormData**: `email` + `cf-turnstile-response`. Always returns generic **200** (anti-enumeration) for well-formed input; 403 `turnstile_failed`, 400 bad-form, 429, 413, 502 otherwise. NEVER reveals whether the email matched.
  - `POST /v1/erasure/confirm` — accepts **JSON** (`application/json` → `{token,email}`) or FormData. Returns **200** clean · **207** partial · **400** invalid/mismatch/expired/used · **429** too-many-attempts · **503** unconfigured.
- **Config-first:** no hard-coded user-facing strings (all in `messages/`), no hard-coded brand/URL/color; route via `@/i18n/routing` (never `next/link`). en/fr keys must stay in parity (`messages.test.ts` enforces it).
- **`NEXT_PUBLIC_API_URL`** (added in Slice B) is the client-exposed worker origin; both pages fail-safe `notFound()` when it (or the flag) is unset. No Clerk gate — this flow is anonymous.
- **Turnstile:** reuse `TurnstileWidget` + `turnstileActive()` from `@indiecrafts/packages-web-ui-components/web/form/TurnstileWidget`; the form appends the token under the field name `cf-turnstile-response`. Site key = `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (opt-in — widget renders nothing when unset, mirroring the worker's opt-in verify).
- **Commit `--no-verify`**; **stage ONLY each task's named files**; prettier `--write` changed files.
- **Writing-style** on comments/docs/commits: active voice, ≤20 words/sentence.

---

### Task 1: Worker confirm-URL → website (WEBSITE_URL)

**Files:**

- Modify: `code/shared/api/src/index.ts` (add `Env.WEBSITE_URL?`)
- Modify: `code/shared/api/src/erasure/request.ts` (build the confirm URL from `WEBSITE_URL`)
- Modify: `code/shared/api/src/erasure/request.test.ts` (cover both branches)
- Modify: `code/shared/api/wrangler.toml` (`[vars]` entry) + `code/shared/api/CHANGELOG.md` + `code/shared/api/.claude/CLAUDE.md`

- [ ] **Step 1: Add the Env field.** In `code/shared/api/src/index.ts` `Env` interface, add (mirroring the `SANITY_PROJECT_ID` `[vars]` JSDoc style):

```ts
/** The website's public origin (`[vars]`) — the erasure confirm-link target. Unset → falls
 *  back to the worker's own origin + `/v1/erasure/confirm` (the current behaviour). */
WEBSITE_URL?: string;
```

- [ ] **Step 2: Write the failing test.** In `request.test.ts`, add a case: when `env.WEBSITE_URL` is set, the token email's confirm link is `${WEBSITE_URL}/erasure/confirm?token=…`; when unset, it stays `${workerOrigin}/v1/erasure/confirm?token=…`. (The suite already injects `sendToken` — assert the `confirmUrl` it receives. Read the existing request.test.ts to reuse its harness + the injected-email seam.)

- [ ] **Step 3: Change the confirm URL** in `code/shared/api/src/erasure/request.ts` (~line 173), inside `writeAndSend()`:

```ts
const confirmUrl = env.WEBSITE_URL
  ? `${env.WEBSITE_URL}/erasure/confirm?token=${token}`
  : `${origin}/v1/erasure/confirm?token=${token}`;
```

(Website path is `/erasure/confirm`; the worker fallback keeps `/v1/erasure/confirm`.)

- [ ] **Step 4: Verify.** `pnpm --filter @indiecrafts/shared-api test` (all green incl. the new branch) + `pnpm --filter @indiecrafts/shared-api tsc` (exit 0).

- [ ] **Step 5: wrangler + docs + commit.** Add to `wrangler.toml` `[vars]` a commented example line `# WEBSITE_URL = "https://your-site.example"` (mirroring the commented `SANITY_*` examples — it's public, so `[vars]` not a secret). Add an api `CHANGELOG.md` `### Changed` entry (the confirm link now targets the website when `WEBSITE_URL` is set). Update the api brief's erasure sentence to note `WEBSITE_URL` gates the confirm-link origin. Prettier; commit `--no-verify` (`feat(compliance): erasure confirm-link targets the website via WEBSITE_URL`).

---

### Task 2: Website `/erasure` request page + form

**Files:**

- Create: `code/projects/web/surfaces/website/src/app/[locale]/erasure/page.tsx`
- Create: `code/projects/web/surfaces/website/src/user-interface/erasure/ErasureRequestForm.tsx` + `code/projects/web/surfaces/website/src/user-interface/erasure/submit.ts` (pure helpers) + `code/projects/web/surfaces/website/src/user-interface/erasure/submit.test.ts`
- Modify: `messages/en.json` + `fr.json` (`legal.erasure.request.*`) + `src/config/features.ts` (flag) + `src/config/pages.ts` (entry)

**Interfaces:**

- Produces: `submitErasureRequest(input: { apiUrl: string; email: string; turnstileToken: string | null }): Promise<"sent" | "turnstile" | "error">` and (Task 3) `submitErasureConfirm(...)` in `submit.ts`. `ErasureRequestForm({ copy }: { copy: ErasureRequestCopy })` — a client component.

- [ ] **Step 1: Feature flag + page config.** `features.ts`: add `erasure: true` under the existing `legal` group (sibling of `dataRequest`). `pages.ts`: add a plain `PageConfig` (mirror the Slice-B `account` entry): `erasure: { key: "/erasure", id: "erasure", slug: "/erasure", enabled: features.legal.erasure }`.

- [ ] **Step 2: The pure request helper + failing test.** Create `submit.ts`:

```ts
export async function submitErasureRequest(input: {
  apiUrl: string;
  email: string;
  turnstileToken: string | null;
}): Promise<"sent" | "turnstile" | "error"> {
  try {
    const form = new FormData();
    form.set("email", input.email);
    if (input.turnstileToken)
      form.set("cf-turnstile-response", input.turnstileToken);
    const res = await fetch(`${input.apiUrl}/v1/erasure/request`, {
      method: "POST",
      body: form,
    });
    if (res.status === 200) return "sent"; // generic anti-enumeration success
    if (res.status === 403) return "turnstile"; // turnstile_failed
    return "error";
  } catch {
    return "error";
  }
}
```

`submit.test.ts` (vitest — the website already runs vitest for `messages.test.ts`): stub `globalThis.fetch`; assert 200→"sent" and the POST is FormData to `${apiUrl}/v1/erasure/request` with `email` + `cf-turnstile-response` fields; 403→"turnstile"; 500/throw→"error". Run it, see it fail, implement, see it pass.

- [ ] **Step 3: The request form** `ErasureRequestForm.tsx` (`"use client"`) — mirror `DataRequestForm`'s TurnstileWidget usage (map §2): hold `email` + `tsToken` state; render an email input + `<TurnstileWidget key={tsKey} onToken={setTsToken} />` + a submit button `disabled={busy || !email || (turnstileActive() && !tsToken)}`; on submit call `submitErasureRequest({ apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "", email, turnstileToken: tsToken })`; render the generic "sent" message on "sent" (anti-enumeration — same message regardless), a Turnstile-retry message on "turnstile" (bump `tsKey` to remount), an error on "error". Copy from the `copy` prop; use shadcn primitives as `DataRequestForm` does. `role="status"` for the result.

- [ ] **Step 4: i18n.** Add `legal.erasure.request.*` to `messages/en.json` + `fr.json` (heading, body, emailLabel, emailPlaceholder, submitButton, pending, sent [the generic anti-enumeration line], turnstile, error). English warm/editorial; French translated; identical key shape.

- [ ] **Step 5: The page** `[locale]/erasure/page.tsx` (server component, mirror `account/page.tsx`): `setRequestLocale`; gates `if (!isPageVisible(pages.erasure)) notFound();` + `if (!process.env.NEXT_PUBLIC_API_URL) notFound();` (NO Clerk gate); `getTranslations({ locale, namespace: "legal.erasure.request" })` → typed `copy`; render `<DefaultLayout><ErasureRequestForm copy={copy} /></DefaultLayout>` + `PageSchemas`. `generateMetadata` like the sibling pages.

- [ ] **Step 6: Verify + commit.** `pnpm --filter @indiecrafts/web-surfaces-website tsc` (exit 0) + `test` (messages parity + the submit test pass). Prettier. Commit `--no-verify` (`feat(compliance): website /erasure request page`).

---

### Task 3: Website `/erasure/confirm` page + DSAR cross-link + docs

**Files:**

- Create: `code/projects/web/surfaces/website/src/app/[locale]/erasure/confirm/page.tsx`
- Create: `code/projects/web/surfaces/website/src/user-interface/erasure/ErasureConfirmForm.tsx`
- Modify: `code/projects/web/surfaces/website/src/user-interface/erasure/submit.ts` (+ `.test.ts`) — add `submitErasureConfirm`
- Modify: `messages/en.json` + `fr.json` (`legal.erasure.confirm.*` + `legal.dataRequest.erasureNote`) + the DSAR page (render the cross-link) + `CHANGELOG.md` (website) + `code/docs/apps/web/config/feature-flags.md`

**Interfaces:** Consumes `submitErasureRequest` (Task 2). Produces `submitErasureConfirm(input: { apiUrl; token; email }): Promise<"done"|"partial"|"mismatch"|"expired"|"error">`.

- [ ] **Step 1: The confirm helper + failing test.** Add to `submit.ts`:

```ts
export async function submitErasureConfirm(input: {
  apiUrl: string;
  token: string;
  email: string;
}): Promise<"done" | "partial" | "mismatch" | "expired" | "error"> {
  try {
    const res = await fetch(`${input.apiUrl}/v1/erasure/confirm`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: input.token, email: input.email }),
    });
    if (res.status === 200) return "done";
    if (res.status === 207) return "partial";
    if (res.status === 429) return "expired"; // too many attempts → tell them to restart
    if (res.status === 400) return "mismatch"; // bad/expired/used token OR email mismatch
    return "error";
  } catch {
    return "error";
  }
}
```

Add `submit.test.ts` cases: 200→done, 207→partial, 400→mismatch, 429→expired, 500→error; assert JSON body `{token,email}` to `${apiUrl}/v1/erasure/confirm`.

- [ ] **Step 2: The confirm form** `ErasureConfirmForm.tsx` (`"use client"`) — takes `{ copy, token }`; a typed-email input; on submit call `submitErasureConfirm({ apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "", token, email })`; map done→success, partial→partial, mismatch→mismatch, expired→expired, error→error copy in a `role="status"` region. No token rendered as HTML beyond a controlled hidden value (React auto-escapes — map §6).

- [ ] **Step 3: The page** `[locale]/erasure/confirm/page.tsx` (server component): `type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ token?: string }> }`; `const { token } = await searchParams`; same gates (flag + `NEXT_PUBLIC_API_URL` → notFound); `getTranslations("legal.erasure.confirm")` → copy; render `<DefaultLayout><ErasureConfirmForm copy={copy} token={token ?? ""} /></DefaultLayout>`. If `!token`, the form can show the mismatch/invalid copy on submit (or render a "missing token" note) — keep it simple: pass `token ?? ""` and let the worker 400 it.

- [ ] **Step 4: i18n + DSAR cross-link.** Add `legal.erasure.confirm.*` (heading, body, emailLabel, emailPlaceholder, submitButton, pending, success, partial, mismatch, expired, error) to both message files. Add `legal.dataRequest.erasureNote` (a short "To delete your data faster, use the erasure page" line). In `data-request/page.tsx`, render the note as a `<Link href="/erasure">` (from `@/i18n/routing`) near the heading (resolve the string via the existing `getTranslations("legal.dataRequest")`). Keep en/fr parity.

- [ ] **Step 5: Docs.** Website `CHANGELOG.md` `### Added`: the anonymous branded `/erasure` + `/erasure/confirm` flow + the `legal.erasure` flag. `code/docs/apps/web/config/feature-flags.md`: document `legal.erasure` (mirror `legal.dataRequest`).

- [ ] **Step 6: Verify + commit.** `pnpm --filter @indiecrafts/web-surfaces-website tsc` (exit 0) + `test` (parity + submit tests). Prettier. Commit `--no-verify` (`feat(compliance): website /erasure/confirm page + DSAR cross-link`).

---

## Self-review

**1. Spec coverage (Section 3):** branded request page + Turnstile (T2), branded confirm page (T3), emailed link → website (T1 worker tweak), DSAR cross-link + keep DSAR (T3), flag + fail-safe gate (T2/T3), i18n (T2/T3). Covered.

**2. Placeholder scan:** helpers + gates + page structure are concrete; copy wording is authored per the DESIGN.md voice following the `dataRequest` baseline; the form JSX mirrors `DataRequestForm`/`AccountDeletePanel` (implementer reads them).

**3. Type/name consistency:** `submitErasureRequest`/`submitErasureConfirm` shared in `submit.ts` across T2/T3; the worker contracts (FormData request / JSON confirm; 200/207/400/403/429) match Phase-4a `request.ts`/`confirm.ts` exactly; the `WEBSITE_URL` path (`/erasure/confirm`) matches the T3 page route.

**Ruling RC-FORMHOME:** the forms + helpers live website-local under `src/user-interface/erasure/` (mirroring `AccountDeletePanel`), NOT `ui-components` — they are worker-URL-specific, form-encoded plumbing, not a reusable design-system brick. Cost if wrong: move to ui-components + add a story later.
**Ruling RC-CROSSLINK:** the DSAR cross-link is a note/`<Link>` on the `/data-request` page (the footer is CMS-driven Sanity nav — a code change can't add a footer link). Site-wide footer discoverability (add `/erasure` to `pages.ts` + `ROUTE_LABELS`, editor adds it to the nav doc) is a deferred optional step. Cost if wrong: add the ROUTE_LABELS entry later.
**Ruling RC-CONFIRM-JSON:** the confirm form POSTs JSON (the worker accepts both; JSON is the natural client fetch, mirroring `submitAccountErasure`); the request form MUST use FormData (the worker's request route reads `formData()` only). Cost if wrong: switch the confirm to FormData; trivial.
