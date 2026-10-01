---
title: "Authentication (cross-app)"
description: "One authentication system across every deployable, built on Clerk."
status: stable
---

# Authentication (cross-app)

One authentication system across every deployable, built on [Clerk](https://clerk.com).
Users sign in on all apps. A single global `admin` role gates the admin app. Sign-in uses a
**password** or an **email one-time code**, on every surface (website · app · the Capacitor
shell). Social connections are off: OAuth providers such as Google refuse to run inside an
embedded web view, and one method set keeps every surface identical. No database: the role
rides the signed session token.

Full design + review record: `docs/superpowers/specs/2026-08-21-clerk-auth-multi-app-design.md`.

## The two bricks

Auth is split by scope, because the two Clerk SDKs cannot be shared but the contract can.

| Brick                               | Scope             | Holds                                                                                        |
| ----------------------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| `@indiecrafts/packages-shared-auth` | shared (DOM-free) | `Roles`, `AppSessionClaims`, `isAdmin(claims)` — the portable contract. No Clerk/React/Next. |
| `@indiecrafts/packages-web-auth`    | web               | `AppClerkProvider` + `authAppearance()` — the themed provider for the Next surfaces.         |

## Per-platform SDK

| App                 | Stack                | Clerk SDK       |
| ------------------- | -------------------- | --------------- |
| website, admin, app | Next 16 / Cloudflare | `@clerk/nextjs` |

The Capacitor shell loads the `app` surface, so it signs in through `@clerk/nextjs` like the app.

## The role model

The role lives in Clerk `publicMetadata` — backend-writable only, so it is tamper-proof.
The Clerk Dashboard surfaces it on the session token via the claim:

```json
{ "metadata": "{{user.public_metadata}}" }
```

Every check is then a JWT read, not an API call. `isAdmin(claims)` is strict
(`role === "admin"`) and safe on `null` / malformed claims. **Enforce it server-side** in
every admin server action, route handler, and protected layout — middleware is coarse
routing and is bypassable (Next.js CVE-2025-29927), never the sole boundary.

Each app types Clerk's claims from the one shared home:

```ts
// <app>/src/global.d.ts (or types/globals.d.ts)
import type { AppSessionClaims } from "@indiecrafts/packages-shared-auth";
declare global {
  interface CustomJwtSessionClaims extends AppSessionClaims {}
}
```

### Bootstrapping the first admin

`grantAdmin` in the admin dashboard needs an existing admin, so the first admin cannot be
made from the UI — a chicken-and-egg. Grant it out-of-band, one of two ways:

- **Clerk Dashboard** — Users → the user → Public metadata → `{ "role": "admin" }`.
- **Script** — `node code/shared/scripts/data/set-admin.mjs <email> [more emails...]` sets
  `public_metadata.role = "admin"` via the Clerk Backend API. It reads `CLERK_SECRET_KEY`
  from the env or the app surface's `.env.local`, targets whichever instance that secret
  belongs to (`sk_test_` = dev, `sk_live_` = prod), is idempotent, and accepts several
  emails at once. The user must have signed up once first, or it reports `not-found`.
  Colocated test: `set-admin.test.mjs`.

Either way, the session claim below must be set (Dashboard → Sessions) so the role reaches
the JWT. Sign out and back in after a change — the role refreshes on the next session.

```json
{ "metadata": "{{user.public_metadata}}" }
```

A signed-in **non-admin** who lands on the admin `/sign-in` sees a "not an admin — sign out"
panel (`NotAdminNotice`) — Clerk's `<SignIn>` renders blank for an already-signed-in user, so
without it a non-admin would be stuck on a blank page.

## Clerk dashboard settings

Apply these on the dev instance, then on prod:

1. **User & Authentication → Email, phone, username:** enable **Email address** (required).
2. **User & Authentication → Email:** enable **Password** and **Email verification code**.
3. **SSO connections:** disable every social provider.

Nothing in the code enforces this — the hosted `<SignIn>`/`<SignUp>` render whatever the
dashboard enables, so the dashboard is the one home for the method set.

## Suspicious logins

Enable Clerk's **unauthorized sign-in detection**: it emails the account owner when a sign-in
looks unusual. We run on the **Clerk free
plan**, so the one-click revoke-from-email button is unavailable — revoke is manual from the
account UI. Bot protection and user-enumeration protection stay on by default; the
`@indiecrafts/packages-shared-security` `withGuard` + Cloudflare WAF are defence-in-depth.

## Web wiring

Next-specific provider + middleware details: [Authentication (Clerk)](/projects/web/website/config/auth).

**Clerk version — Core 3.** Sign-in theming uses the Core 3 appearance variables
(`colorForeground`/`colorMutedForeground`/`colorNeutral`/…) in `authAppearance()` — the Core 2
names (`colorText`/`colorTextSecondary`) are ignored, which read as dark-on-dark text. Conditional
auth UI uses `<Show when="signed-in"/"signed-out">`; the Core 2 `<SignedIn>`/`<SignedOut>` control
components were removed.

## Localization (UI + emails)

Clerk speaks the visitor's language on every surface.

**UI** — `@clerk/localizations` bundles (`enUS`/`frFR`) passed to each surface's
`<ClerkProvider localization>`. Web: `AppClerkProvider` takes a `locale` prop and mounts inside
`[locale]/layout.tsx` (so it reads the route locale). **Caveat:** only `en-US` is Clerk-maintained — other locales (incl. `frFR`) are
**community** bundles, so a few strings may stay English. Clerk's hosted **Account Portal** is
always English, so sign-up is **self-hosted** (`/sign-up` routes) instead — which also lets it
carry the locale (below).

**Locale capture** — each sign-up writes the active locale to Clerk `unsafeMetadata.locale`
(`<SignUp unsafeMetadata>`). The api `user.created`/`updated`
webhook validates it (`isLocale`) and mirrors it to `user_profiles.locale`.

**Emails** — the `localization` prop does **not** touch Clerk's emails. To localize them, the api
takes over delivery via the `email.created` webhook. **Operator runbook:**

1. Set `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` on the web surfaces so sign-up uses the app's own
   `<SignUp>` (not the English Account Portal).
2. Set the api's `RESEND_API_KEY` + `EMAIL_FROM` — **required before step 3**, or the taken-over
   emails have no sender and fail (the webhook returns 502 so failures are visible, never silent).
   The `EMAIL_FROM` domain must be **verified in the Resend account of that key** (Resend → Domains,
   then its DKIM/SPF records in DNS). An unverified domain fails each send: the log reads
   `clerk email delivery failed` with `resend 403`.
3. In the **Clerk Dashboard → Customization → Emails**, toggle **"Delivered by Clerk" off** for the
   templates you want localized (verification code, reset-password code, magic link). Clerk then
   fires `email.created`; the api renders our localized copy from `user_profiles.locale` and sends
   via Resend. A template left on stays with Clerk (English); a slug we don't localize is forwarded
   as Clerk's own rendered English body — never dropped.
4. The Clerk webhook endpoint (Dashboard → Webhooks) must subscribe to `email.created` (singular).
   Its payload holds Clerk's rendered HTML (~12 KB), so the webhook has its own 64 KB body cap.
   Check: Svix → endpoint → attempts shows `200 {"ok":true}`, and Resend lists the send.

**Auth-email copy is Studio-editable.** The four auth emails contribute groups to the shared
`emailStrings` singleton — `authVerification`, `authResetPassword`, `authMagicLink`,
`authNewDevice` (Studio → E-mails). The api reads them over GROQ (`clerk-email/sanity.ts`,
mirroring `erasure/email.ts`) and renders the editable subject / intro / button label / outro,
resolved to the **recipient's** locale (`user_profiles.locale`). Every field falls back, per field,
to the worker's hardcoded en/fr — so a blank field, an `enabled: false` group, or an
unset/unreachable Sanity never breaks the email. The OTP code, magic-link URL, and device details
are injected by the worker; only the surrounding copy is editable.

**New-device sign-in email.** Clerk's "Sign in from new device" security email (device / OS /
location + a "sign out this device" revoke button) is a **first-party** feature — enable it in the
Dashboard (no code). It flows through the same take-over: toggle it "Delivered by Clerk" off and it
is localized like the rest (the `newDevice` template in `clerk-email/templates.ts`). **Caveat:** the
revoke button survives the take-over **only if** Clerk includes the revoke link in the
`email.created` payload (undocumented) — the localized template renders the button when the link is
present and degrades to a "change your password" warning otherwise. If the link turns out to be
absent, **leave that one template on Clerk's delivery** (English, but keeps the one-click revoke).
The handler logs any un-localized `slug` (no PII), so the real "new device" slug is discoverable in
the api logs once the feature is on — then lock it in `AUTH_TEMPLATES`.

## Commercial-email consent (marketing opt-in)

A user opts in to commercial (marketing) emails. **Capture-only** — no campaign sends here; the
opt-in is stored and mirrored to a Resend audience for a later sender.

**Two stores** (both on `MAIN_DB` / `main` D1):

- **Proof** — `consent_events` (append-only, `consent_type = "marketing_email"`). The legal record.
- **Current state** — `user_profiles.marketing_email` (`NULL` = never decided · `0` = out · `1` = in),
  a fast cache for the settings toggle + the admin list.

**Capture is unchecked by default** on every surface (a pre-ticked box is invalid consent — CJEU
Planet49):

- **Sign-up** — the checkbox value rides Clerk `unsafeMetadata.marketing_email`. The `user.created`
  webhook validates it, sets the column **on the INSERT only** (never re-applied on `user.updated`,
  so a settings change is not clobbered), writes a `consent_events` proof row (`source:"signup"`), and
  syncs Resend. The box renders beside Clerk's prebuilt `<SignUp>`.
- **Account settings** — an editable toggle (`MarketingEmailToggle`) reads
  `GET /v1/consent/marketing-email` and writes each change with `POST` (proof + column + Resend).
- **Sign-in nudge** — a one-time post-sign-in banner (`MarketingNudge`) shown only when the flag is
  `NULL` (a pre-existing account that missed the checkbox). Yes/No record a decision; × snoozes
  per-device. Website and app mount it with `MarketingNudgeMount` (direct fetch); the shared
  `MarketingNudge` is transport-agnostic (`read`/`write` injected).

**Endpoints** (`@indiecrafts/shared-api`): `GET`/`POST /v1/consent/marketing-email` (Clerk JWT — the
caller's own opt-in) · `POST /v1/profiles/consent` (bearer batch → the admin users-list "Emails"
column).

**Resend Contacts** — global, addressed by email (Resend renamed Audiences to Segments, so there
is no audience id); `RESEND_API_KEY` unset → the mirror no-ops, store-only. An opt-in
upserts the contact `unsubscribed:false`; an opt-out flips it `unsubscribed:true`. **Erasure is a pure
delete** — the self-service erasure and the Clerk `user.deleted` webhook both remove the contact
entirely. **No win-back / "former members" audience** — a deliberate compliance decision (right to be
forgotten overrides retained marketing consent). Every sync is best-effort: a Resend failure is logged
and never blocks the D1 write.
