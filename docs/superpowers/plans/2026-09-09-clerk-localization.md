# Clerk localization (UI + emails) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Clerk speaks the visitor's language — the UI components on all five surfaces, and the transactional auth emails (verification code · magic link · reset password) via the api worker.

**Architecture:** `@clerk/localizations` bundles passed to each surface's `<ClerkProvider>`; the visitor's locale captured at sign-up into Clerk `unsafeMetadata` and mirrored to `user_profiles.locale` by the existing webhook; the api's `POST /v1/clerk-webhook` gains an `emails.created` branch that renders localized mail with the worker-safe pattern already in `src/erasure/email.ts`.

**Tech Stack:** `@clerk/nextjs` (website/app/admin) · `@clerk/clerk-expo` (mobile) · `@clerk/clerk-react` (hybrid) · `@clerk/localizations` · Cloudflare Worker (api) · Resend · Sanity (optional copy overlay).

**Spec:** `docs/superpowers/specs/2026-09-09-clerk-localization-design.md`

## Global Constraints

- **The bare `api` Worker cannot import `packages-web-email`** (`server-only` + Next/Sanity). Email rendering reuses the worker-local pattern in `code/shared/api/src/erasure/email.ts` (`resend()`, `escapeHtml`, `pick`).
- **`frFR` is community-maintained** — some Clerk strings may stay English. Acceptable; documented.
- **Email take-over is inert until the operator toggles "Delivered by Clerk" off** and `RESEND_API_KEY` + `EMAIL_FROM` are set.
- Strings in `messages/`; typed routing/tokens per each surface's rules; never commit `.env*`.

---

### Task 1: Web UI localization — `AppClerkProvider` + the website wiring (de-risk)

Gates the web wiring pattern. `AppClerkProvider` mounts in the **root** layout today (above `[locale]`); this task decides + proves how the locale reaches it.

**Files:**

- Modify `code/packages/web/auth/package.json` (add `@clerk/localizations`), `code/packages/web/auth/src/provider.tsx`, add `code/packages/web/auth/src/localization.ts`, export from `code/packages/web/auth/src/index.ts`.
- Modify `code/projects/web/surfaces/website/src/app/layout.tsx` + `code/projects/web/surfaces/website/src/app/[locale]/layout.tsx`.

- [ ] **Step 1** — Read the website's `app/layout.tsx` + `[locale]/layout.tsx` to confirm the structure (root defers `<html>` to `[locale]`). Choose the mount approach: **preferred** — move `<AppClerkProvider>` into `[locale]/layout.tsx` (locale from `params`, nonce from `headers()`); **fallback** if Next rejects the `<html>` placement — keep it in the root layout and derive the locale from the `x-pathname` header the proxy already sets.
- [ ] **Step 2** — `pnpm --filter @indiecrafts/packages-web-auth add @clerk/localizations` (from the repo root). Add `localization.ts`:

```ts
import { enUS, frFR } from "@clerk/localizations";
/** App locale → Clerk localization bundle. Extend as locales are added. */
export function clerkLocalization(locale: string) {
  return locale === "fr" ? frFR : enUS;
}
```

- [ ] **Step 3** — `provider.tsx`: add a `locale` prop, pass it through:

```tsx
export function AppClerkProvider({
  children,
  nonce,
  locale,
}: {
  children: React.ReactNode;
  nonce?: string;
  locale?: string;
}) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <>{children}</>;
  return (
    <ClerkProvider
      appearance={authAppearance()}
      nonce={nonce}
      localization={locale ? clerkLocalization(locale) : undefined}
    >
      {children}
    </ClerkProvider>
  );
}
```

Export `clerkLocalization` from `index.ts`.

- [ ] **Step 4** — Wire the website per Step 1's choice (move the mount into `[locale]/layout.tsx`, passing `locale` from `params` + `nonce` from `headers()`; root layout becomes a passthrough). Add `@clerk/localizations` to the website `transpilePackages` only if tsc/build asks (it's consumed through `packages-web-auth`, already transpiled).
- [ ] **Step 5** — `pnpm --filter @indiecrafts/web-surfaces-website tsc` + `pnpm --filter @indiecrafts/web-surfaces-website build`. Then **visual de-risk**: run the website, open `/fr/sign-in`, confirm the Clerk sign-in card renders French labels. If it does, the pattern is proven.
- [ ] **Step 6: Commit** — `feat(web-auth): locale-aware Clerk localization; wire the website`.

---

### Task 2: Web UI localization — app + admin

Apply the proven Task-1 pattern to the other two web surfaces.

**Files:** `code/projects/web/surfaces/app/src/app/layout.tsx` + `[locale]/layout.tsx`; same for `admin`.

- [ ] **Step 1** — Mirror Task 1's mount approach in the **app** (`[locale]/layout.tsx` passes `locale`+`nonce` to `AppClerkProvider`).
- [ ] **Step 2** — Same for **admin**.
- [ ] **Step 3** — `pnpm --filter @indiecrafts/web-surfaces-app tsc` + `pnpm --filter @indiecrafts/web-surfaces-admin tsc`.
- [ ] **Step 4: Commit** — `feat(app,admin): locale-aware Clerk UI`.

---

### Task 3: Mobile + hybrid UI localization

**Files:**

- Modify `code/projects/mobile/surfaces/main/package.json` + `app/_layout.tsx`.
- Modify `code/projects/hybrid/surfaces/main/package.json` + `src/renderer/src/main.tsx`.

- [ ] **Step 1** — Mobile: `pnpm --filter @indiecrafts/mobile-surfaces-main add @clerk/localizations`. In `_layout.tsx`, resolve the detected locale → `localization={locale === "fr" ? frFR : enUS}` on `<ClerkProvider>`.
- [ ] **Step 2** — Hybrid: `pnpm --filter @indiecrafts/hybrid-surfaces-main add @clerk/localizations`. In `main.tsx`, pass `localization` on `<ClerkProvider>` from the renderer `locale` (the one already used for `IntlProvider`).
- [ ] **Step 3** — `pnpm --filter @indiecrafts/mobile-surfaces-main tsc` + `pnpm --filter @indiecrafts/hybrid-surfaces-main tsc`.
- [ ] **Step 4: Commit** — `feat(mobile,hybrid): locale-aware Clerk UI`.

---

### Task 4: Capture the sign-up locale into `unsafeMetadata`

**Files:** the sign-up components on each surface (verify `<SignUp>` first).

- [ ] **Step 1 (verify-before-code)** — Confirm the hosted `@clerk/nextjs` `<SignUp>` accepts an `unsafeMetadata` prop (check the installed types or Clerk docs). If yes, use it; if not, add a thin `useSignUp` wrapper that calls `signUp.create({ unsafeMetadata: { locale } })`.
- [ ] **Step 2** — Web: pass `unsafeMetadata={{ locale }}` on the `<SignUp>` in each surface's `sign-in`/`sign-up` route (locale from `params`).
- [ ] **Step 3** — Mobile: in `lib/sign-in-machine.ts`'s sign-up path (or the component that calls `signUp.create`), add `unsafeMetadata: { locale }` (locale from the detected app locale).
- [ ] **Step 4** — Hybrid: same on the renderer's `signUp.create`.
- [ ] **Step 5** — `tsc` each touched surface.
- [ ] **Step 6: Commit** — `feat(auth): capture sign-up locale into Clerk unsafeMetadata`.

---

### Task 5: Webhook writes `user_profiles.locale`

**Files:** `code/shared/api/src/index.ts` (the `user.created`/`user.updated` branch of `/v1/clerk-webhook`); test alongside.

- [ ] **Step 1: Failing test** — extend the clerk-webhook test: a `user.created` fixture with `unsafe_metadata.locale = "fr"` should upsert `user_profiles` with `locale = "fr"`.
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement** — in the upsert, read `evt.data.unsafe_metadata?.locale` (validate it's a known locale via the config `isLocale`), write it to the `locale` column. Leave existing behavior otherwise unchanged.
- [ ] **Step 4: Run — PASS**; `pnpm --filter @indiecrafts/shared-api tsc` + `test`.
- [ ] **Step 5: Commit** — `feat(api): mirror Clerk unsafe_metadata.locale to user_profiles.locale`.

---

### Task 6: Email take-over — `emails.created` → localized Resend

**Files:** create `code/shared/api/src/clerk-email/` (`templates.ts` + `handle.ts`), modify `code/shared/api/src/index.ts` (webhook branch) + `src/erasure/email.ts` (extend `pick` to take a locale, or add a shared `pickLocale`); tests alongside.

- [ ] **Step 1 (verify-before-code)** — Confirm the exact `emails.created` (or `email.created`) payload shape from a real Clerk event / current docs: the event `type`, and the fields `slug`, `to_email_address`, `data` (per-template keys: `otp_code`, magic-link URL, reset code), and the user id. Write them into `templates.ts` as typed shapes.
- [ ] **Step 2: Failing test** — an `emails.created` fixture (verification_code slug, `data.otp_code`, a known user with `user_profiles.locale = "fr"`) → the handler resolves `fr`, renders the French body, and calls a mocked `resend` with the French subject. A second case: no locale resolvable → English fallback. A third: mailer unset → silent skip.
- [ ] **Step 3: Run — FAIL.**
- [ ] **Step 4: Implement** —
  - `templates.ts`: a `slug → { subject, render(data, locale) }` map with **hardcoded en/fr** copy for the three slugs (verification code, magic link, reset password), using `escapeHtml`. Optional: read a Sanity `emailStrings` group per slug (mirror `fetchErasureEmailStrings`) with these hardcoded strings as the fallback.
  - `handle.ts`: `handleClerkEmail(env, payload)` — resolve locale from `user_profiles.locale` (MAIN_DB, by user id → email fingerprint fallback → `defaultLocale`), pick the template by `slug`, render, `resend(env, …)` (reuse `erasure/email.ts`'s `resend`). Fail-open on unset mailer / unknown slug.
  - `index.ts`: in `/v1/clerk-webhook`, after Svix verification, branch on the `emails.created` event type → `handleClerkEmail`.
- [ ] **Step 5: Run — PASS**; `pnpm --filter @indiecrafts/shared-api tsc` + `test`.
- [ ] **Step 6: Commit** — `feat(api): localized auth emails via emails.created webhook take-over`.

---

### Task 7: Docs, operator runbook, changelogs, verify

**Files:** `code/docs/shared/architecture/auth.md` (+ a localization section); the `api` brief note; website/app/mobile/hybrid + api CHANGELOGs; the spec `Status`.

- [ ] **Step 1** — Document the UI localization (the `localization` prop + `frFR` community caveat) and the email take-over **operator runbook**: the Clerk Dashboard "Delivered by Clerk" off toggles for the three templates, the `RESEND_API_KEY` + `EMAIL_FROM` prerequisite, and that until toggled, Clerk keeps sending English.
- [ ] **Step 2** — Changelog entries per touched area (plain-language why).
- [ ] **Step 3** — Flip the spec `Status:` to "Implemented".
- [ ] **Step 4** — `pnpm check:tags` + `check:tasks` + `check:secret-leak` + `check:typed-routing` green; tsc/test on every touched surface + the api green.
- [ ] **Step 5: Commit** — `docs(auth): Clerk localization — UI + email operator runbook`.

---

## Self-review

- **Spec coverage:** UI (T1–T3) · locale capture (T4) · `user_profiles.locale` (T5) · email take-over (T6) · docs/runbook (T7). ✓
- **Verify-before-code seams called out in-task:** T1 (layout mount), T4 (`<SignUp>` unsafeMetadata), T6 (`emails.created` payload). ✓
- **No placeholders:** each step has concrete code or an exact command. Reuse is explicit (T6 reuses `erasure/email.ts`). ✓
- **Operator dependency** is a T7 doc deliverable, not a code gap.
