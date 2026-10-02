---
title: "Clerk emails (take-over + support address)"
description: "We send every Clerk authentication and security email ourselves — branded, localized, from no-reply@updates.indiecrafts.dev, with an editor-owned support add…"
status: stable
---

# Clerk emails (take-over + support address)

We send every Clerk authentication and security email ourselves — branded, localized,
from `no-reply@updates.indiecrafts.dev`, with an editor-owned support address in the
footer. Clerk still triggers each email; our `code/shared/api` worker renders and sends it.

Companion: [Authentication (Clerk)](./auth) · [Email preferences](/projects/web/website/config/email-preferences).

## The take-over model

Clerk delivers each email template one of two ways, set by the template's
`delivered_by_clerk` flag:

- `delivered_by_clerk: true` (Clerk's default) — Clerk renders and sends the email. No
  webhook fires. The recipient gets Clerk's generic email.
- `delivered_by_clerk: false` — Clerk does **not** send. It fires an `email.created`
  webhook instead. Our api receives it and sends our own branded, localized email.

So the take-over is **dormant until each template is toggled off**. A template toggled
off with no working webhook endpoint sends **no email at all** — set up and verify the
endpoint (below) before toggling.

### The pipeline

1. Clerk fires `email.created` → Svix delivers it to `POST /v1/clerk-webhook` on the
   deployed api.
2. `index.ts` verifies the Svix signature with `CLERK_WEBHOOK_SECRET` (no secret → 503;
   bad signature → 401).
3. `clerk-email/handle.ts` resolves the recipient's locale (`user_profiles.locale`, else
   the default), matches the template `slug` to a kind (`clerk-email/sanity.ts`
   `authKind`), and renders the copy (`clerk-email/templates.ts`).
4. Copy comes from the `clerkEmails` Sanity singleton in the recipient's locale, with a
   per-field fallback to the template's hardcoded en/fr — a missing or unreachable Sanity
   never blocks a mandatory auth email.
5. The email gets the support-address footer (`emailStrings.supportEmail`) and sends via
   Resend from `EMAIL_FROM`.

An unknown slug (one we do not localize) forwards Clerk's own rendered body unchanged, so
nothing is ever dropped.

### The 12 localized kinds

`verification` · `resetPassword` · `magicLink` · `newDevice` · `passwordChanged` ·
`passwordRemoved` · `passkeyAdded` · `passkeyRemoved` · `mfaEnabled` ·
`primaryEmailChanged` · `accountLocked` · `invitation`.

Each maps to a Clerk template slug (`SLUG_FOR_KIND` in `clerk-email/sanity.ts`). Billing
and waitlist templates are not localized — toggled off, they forward Clerk's body.

## Editing the copy — Sanity

The **E-mails Clerk** singleton (`clerkEmails`, Studio → Contenu partagé) holds one group
per kind: `subject` / `intro` / `outro` (+ `buttonLabel` on `magicLink`, `newDevice`,
`invitation`; on `newDevice` it labels the disconnect link, whichever one the email carries).
Every field is translatable. An empty field falls back to the hardcoded
en/fr. The schema lives in `code/packages/web/email/src/sanity/clerk-emails.ts`.

The same singleton also holds a **`welcome`** group — the post-signup welcome email. Unlike
the kinds above it is **not** a Clerk template (Clerk has none): it fires on the `user.created`
webhook (best-effort, in the sign-up locale) and is sent by `clerk-email/welcome.ts`, separate
from the `email.created` take-over. Editable copy, same fallback + support footer as the rest.

The support address is one global value — `emailStrings.supportEmail` (Studio → E-mails),
seeded `support@indiecrafts.dev`. It shows in the footer of **every** transactional email
(the Clerk take-over, the erasure emails, and the website emails).

## Setup — the webhook endpoint (manual, once per instance)

The Clerk Backend API cannot create the webhook endpoint; it lives in the Svix dashboard
Clerk hosts. Do this once per Clerk instance (dev, then production):

1. Open the webhook dashboard. Generate a magic link:
   `clerk api POST /webhooks/svix_url` → open the returned URL.
2. Add an endpoint → URL `https://<api-domain>/v1/clerk-webhook`. For dev this is the
   deployed dev api (`wrangler deploy --env dev` prints the `workers.dev` URL); for
   production, the api's own domain.
3. Subscribe it to the **`email.created`** event.
4. Copy the endpoint's **Signing Secret** (`whsec_…`) and set it as the api secret:
   `wrangler secret put CLERK_WEBHOOK_SECRET --env <env>`. It must match, or every webhook
   is rejected with 401.

## Activate — verify, then toggle

**Verify first.** With the endpoint live and the api deployed, trigger one auth email
(request a verification code on dev). Confirm the recipient gets **our** branded email
from `no-reply@updates.indiecrafts.dev`, not Clerk's generic one. Watch the api logs with
`wrangler tail --env <env>` for the `POST /v1/clerk-webhook` hit. If the email does not
arrive, fix the endpoint before toggling — do not toggle a broken pipeline.

**Then toggle.** Turn off Clerk delivery for every template (auth/security drive the
take-over; billing/waitlist are inert but toggled too for one consistent rule):

```bash
for slug in verification_code reset_password_code magic_link_sign_in magic_link_sign_up \
  magic_link_user_profile new_device_sign_in password_changed password_removed \
  passkey_added passkey_removed mfa_enabled primary_email_address_changed \
  account_locked invitation billing_receipt billing_failed_payment \
  billing_free_trial_renewal_upcoming billing_free_trial_renewal_failed \
  billing_price_transition_upcoming commerce_gateway_account_deauthorized \
  opaque_token_usage_limit_alert opaque_token_usage_limit_exceeded \
  waitlist_entry_created waitlist_confirmation waitlist_invitation; do
  clerk api PATCH templates/email/$slug --input-json '{"delivered_by_clerk":false}'
done
```

Re-list to confirm: `clerk api templates/email` → every row `delivered_by_clerk: false`.

**End-to-end.** Sign up on dev → the verification email is ours: branded shell, localized,
support address in the footer. New-device sign-in stays `enabled: true`, so it still fires.

## Google OAuth — the app name on the consent screen

The Google sign-in consent screen shows the app name of the Google OAuth client. On a
**development** Clerk instance, Clerk uses its own shared Google credentials, so the screen
shows a generic Clerk name. To show **indiecrafts**, use a production Clerk instance with
your own Google OAuth client:

1. Create the production Clerk instance (Clerk dashboard).
2. In Google Cloud Console → APIs & Services → Credentials, create an **OAuth 2.0 Client
   ID** (Web application). Set the OAuth consent screen **App name** to `indiecrafts`.
3. Add Clerk's production redirect URI (the production instance's Google connection page
   shows it).
4. Paste the client id + secret into the Clerk production instance's Google connection
   (custom credentials).

The dev instance keeps Clerk's shared credentials — the generic name there is expected and
does not affect production.

## Files

- `code/shared/api/src/clerk-email/` — the take-over: `handle.ts`, `templates.ts`,
  `sanity.ts`. Reads `clerkEmails` + `emailStrings.supportEmail` over GROQ-HTTP; sends via
  Resend. `renderEmailLayout` is `server-only`/Next-coupled, so the worker appends a
  worker-safe support footer (`erasure/email.ts` `supportFooter`) instead of the shell.
- `code/packages/web/email/src/sanity/clerk-emails.ts` — the `clerkEmails` Studio schema.
- `code/shared/api/src/index.ts` — the `POST /v1/clerk-webhook` route (Svix-verified).

## Secrets

- `CLERK_WEBHOOK_SECRET` (`whsec_…`) — the Svix endpoint signing secret. No secret → the
  route 503s. Roll it before production; never commit it.
- `RESEND_API_KEY` · `EMAIL_FROM` — the mailer. Unset → the send is a silent no-op, so a
  toggled-off template with no mailer sends nothing.
