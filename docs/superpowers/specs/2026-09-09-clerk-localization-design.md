# Clerk localization — UI + emails — design

- **Date:** 2026-09-09
- **Status:** Implemented — UI localization on all 5 surfaces, self-hosted sign-up (locale capture), `user_profiles.locale` mirror, and the `emails.created` take-over are built. The email take-over is inert until the operator toggles "Delivered by Clerk" off (see the runbook in `code/docs/shared/architecture/auth.md`).
- **Author:** platform
- **Scope:** Make Clerk speak the visitor's language on every surface — both the **UI components** (sign-in / sign-up / user-button / the account modal's Clerk tabs) and the **transactional auth emails** (verification code, magic link, reset password). Covers all five surfaces (website, app, admin, mobile, hybrid) for the UI, and the `api` worker for the emails.

## 1. Goal

Today the app is fully bilingual (en/fr via next-intl / react-intl), but Clerk is a monolingual English island: no `localization` prop is passed anywhere (`@clerk/localizations` isn't even a dependency), and Clerk sends its own English auth emails. This closes both gaps so a `fr` visitor gets French Clerk UI **and** French auth emails.

## 2. Decisions (resolved in brainstorming)

1. **Do both now, fully** — UI localization + the email take-over in one project.
2. **Locale source = captured at sign-up.** Write the visitor's current UI locale into Clerk `unsafeMetadata.locale` at sign-up, mirror it to `user_profiles.locale` via the existing webhook, and the email handler reads it — so **every** email is localized, including the first verification code.
3. **All five surfaces** get UI localization (admin included — its only Clerk UI is sign-in; cheap).
4. **Bundles = `@clerk/localizations`** community locales (`enUS` / `frFR`), accepting that non-`en-US` is community-maintained (possible gaps).
5. **Email copy = worker-side, hardcoded en/fr with an optional Sanity overlay** — mirrors `erasure/email.ts` (hardcoded fallback + Studio-editable `emailStrings` groups). The hardcoded strings are the always-works base; the Sanity overlay is additive.

## 3. Non-goals

- **Not** localizing Clerk's **hosted Account Portal** — it stays English by Clerk's design; we use embedded components, so it never shows.
- **Not** taking over every Clerk email type in v1 — only the three core auth emails (verification code, magic link, reset password). Anything the operator doesn't toggle off stays with Clerk.
- **No** change to the auth model, the erasure/export contracts, or `clerkMiddleware`.

## 4. Constraints (the shape-forcing facts)

- **`AppClerkProvider` mounts in the ROOT layout** (`app/layout.tsx`), which sits **above** the `[locale]` segment — so the active locale is not available where the provider currently mounts. (§5.1 moves it.)
- **The Next email brick (`packages-web-email`) is `import "server-only"` + Sanity/Next-coupled** — the bare `api` Worker cannot import it (same reason `withGuard` can't). The email take-over lives in the Worker, so it **reuses the worker-safe pattern already in `src/erasure/email.ts`** (a local `resend()`, `escapeHtml`, `pick(localeValue)`, Sanity-copy-over-GROQ with a hardcoded fallback).
- **`user_profiles.locale` already exists** (migration `0001`) but is unpopulated today — the webhook must start writing it (§5.2).
- **Clerk gives no locale to the first email out of the box** — solved by capturing it at sign-up into `unsafeMetadata` (§5.2), which the `user.created` webhook mirrors to `user_profiles.locale` before/at the moment the email handler needs it.

## 5. Architecture

### 5.1 UI localization

Add `@clerk/localizations`. One tiny resolver maps the app locale to a Clerk bundle:

```ts
// en → enUS, fr → frFR (extend as locales are added)
export function clerkLocalization(locale: string) {
  return locale === "fr" ? frFR : enUS;
}
```

Per surface:

- **Web (website / app / admin):** `AppClerkProvider` gains a `locale` prop and passes `localization={clerkLocalization(locale)}`. **Move the `<ClerkProvider>` mount from the root layout into `[locale]/layout.tsx`**, where `locale` is a route param (server component, no client hook). This is safe because:
  - `auth()` in server components + route handlers resolves via `clerkMiddleware` (proxy), **independent** of where the provider mounts.
  - Every rendered page/route is under `[locale]`, so the provider still wraps all Clerk UI + client hooks.
  - The CSP `nonce` (read from `headers()` in the root today) is read in `[locale]/layout` instead and forwarded unchanged.
- **Mobile (`@clerk/clerk-expo`):** pass `localization={clerkLocalization(locale)}` on `<ClerkProvider>` in `app/_layout.tsx`, from the already-detected `expo-localization` locale.
- **Hybrid (`@clerk/clerk-react`):** pass `localization={clerkLocalization(locale)}` on `<ClerkProvider>` in `main.tsx`, from the renderer's detected locale.

Switching locale re-renders the provider with a new bundle (Clerk reads the current `localization` prop; a full navigation between `/en` and `/fr` re-mounts it, which is how the surfaces switch locale).

### 5.2 Locale capture at sign-up → `user_profiles.locale`

- **Web hosted `<SignUp>`:** pass `unsafeMetadata={{ locale }}` so the created Clerk user carries its sign-up locale. (Verify-before-code: confirm the hosted `<SignUp>` accepts `unsafeMetadata`; if not, wrap the one field via a `useSignUp` `signUp.create({ unsafeMetadata })` step.)
- **Mobile / hybrid custom flows:** set `unsafeMetadata: { locale }` on the existing `signUp.create(...)` call (mobile's `lib/sign-in-machine.ts` path; hybrid's renderer auth).
- **api webhook (`user.created` / `user.updated`):** read `unsafe_metadata.locale` from the event and write it to `user_profiles.locale` (add to the existing upsert — the handler already upserts the row). A later locale change (user switches language) can re-write it via `user.updated`.

### 5.3 Email take-over (api worker)

- **Operator step (Clerk Dashboard → Customization → Emails):** toggle **"Delivered by Clerk" off** for: **Verification code**, **Magic link**, **Reset password code**. Clerk then fires `emails.created` instead of sending.
- **api `POST /v1/clerk-webhook`:** add an `emails.created` branch alongside the existing `user.*` branches (same Svix HMAC verification). From the payload take `slug`, `to_email_address`, and `data` (the raw template variables: `otp_code`, magic-link URL, reset code) + the user id.
- **Resolve locale:** look up `user_profiles.locale` (MAIN_DB) by user id (fallback: by email fingerprint); if absent, fall back to `defaultLocale`.
- **Render + send:** reuse `src/erasure/email.ts`'s `resend()` / `escapeHtml`, and a `pick(value, locale)` (extend the erasure `pick` to take a locale). Copy per `slug` comes from **hardcoded en/fr strings** (always present), optionally overlaid by a new `emailStrings` Sanity group per slug (matching the erasure groups) with the hardcoded strings as the fallback. A new module `src/clerk-email/` (or `src/auth-email.ts`) owns the slug→template map.
- **Fail-open:** an unconfigured mailer (`RESEND_API_KEY`/`EMAIL_FROM` unset) or a missing locale must never throw — mirror the erasure module's silent-skip / English-fallback posture. But note: if the operator toggled Clerk delivery **off** and our mailer is unset, the email is **not sent at all** — so the docs must state the toggles require `RESEND_API_KEY` + `EMAIL_FROM` first.

## 6. Data flow

1. Visitor on `/fr` opens sign-up → the surface passes `unsafeMetadata.locale = "fr"` → Clerk creates the user with that metadata.
2. Clerk fires `user.created` → api webhook upserts `user_profiles` with `locale = "fr"`.
3. Clerk needs to send the verification code → (with "Delivered by Clerk" off) fires `emails.created { slug:"verification_code", to_email_address, data:{ otp_code } }`.
4. api webhook resolves `locale = "fr"` from `user_profiles`, renders the French verification-code email, sends via Resend.
5. Meanwhile the Clerk UI (sign-up/sign-in) already renders in French via the `localization` prop (§5.1).

## 7. Testing

- **UI:** with `frFR` wired, a `fr` render of a Clerk component shows French labels (a light integration/snapshot per web surface; manual for mobile/hybrid).
- **Locale capture:** signing up on `/fr` stores `unsafe_metadata.locale`; the webhook writes `user_profiles.locale` (unit-test the webhook branch with a `user.created` fixture carrying metadata).
- **Email handler:** an `emails.created` fixture (per slug) → the handler resolves the locale, renders the right-language copy, and calls a mocked `resend`; asserts the fallback to English when no locale resolves and the silent-skip when the mailer is unset. Mirrors the existing `erasure/email` test seam (inject the strings/resend).

## 8. Phasing (within this one project)

1. **UI localization** (dep + resolver + the 5 provider wirings + the `[locale]/layout` move).
2. **Locale capture** (sign-up metadata on each surface + the webhook `user_profiles.locale` write).
3. **Email take-over** (the `emails.created` webhook branch + the worker-side localized templates + tests).
4. **Docs + operator runbook** (the Dashboard toggles, the `RESEND_API_KEY`/`EMAIL_FROM` prerequisite, the frFR-gaps caveat) + changelogs.

## 9. Risks / open items

- **Verify-before-code:** (a) hosted `<SignUp>` accepts `unsafeMetadata`; (b) the exact `emails.created` payload field names (`slug` vs `email_address_id`, `data` keys per template) — confirm against a real Clerk event / docs before wiring the handler.
- **frFR gaps:** community locale; some strings may stay English. Acceptable; note it.
- **Operator dependency:** the email take-over is inert until the Dashboard toggles are flipped, and requires `RESEND_API_KEY` + `EMAIL_FROM`. Until then Clerk keeps sending English (or, if toggled off with no mailer, nothing) — the docs must make this loud.
- **Locale drift:** if a user switches language after sign-up, `user_profiles.locale` only updates when a `user.updated` carries new metadata — a follow-up could write it on locale switch.

## Issue tags

- `@debt E2E` — the localized email round-trip is unit-tested (mock resend) + manually verified; a full Clerk→webhook→Resend E2E needs a live Clerk instance with the toggles off.
