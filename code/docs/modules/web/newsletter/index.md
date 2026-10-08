---
title: "Newsletter capture"
description: "An editor-droppable email capture block (module.newsletter) with a gated API route, a Studio subscriber desk, optional double opt-in + owner-alert emails, an…"
status: stable
---

# Newsletter capture

An editor-droppable email capture block (`module.newsletter`) with a gated API route, a Studio
subscriber desk, optional **double opt-in** + owner-alert emails, and a CSV export. Works out of the
box with **no API keys** — a signup lands as a Sanity `subscriber` document you read in the Studio.
With the api and Resend wired, confirmed subscribers also join **Resend's `news` topic** — the same
list signed-in members opt into — so one Resend Broadcast reaches both (see [Resend](#resend-one-list)).

Lives in the **`@indiecrafts/modules-web-newsletter`** module (`code/modules/web/newsletter`): the subscribe
engine, the `subscriber` doc, and an editable **`newsletterSettings`** singleton — shipped as a
one-line `composeStudio`-group contribution. The public form stays a page-builder block (renderer in
`@indiecrafts/packages-web-ui-components`). The emails' config + copy live on the shared **E-mails** entity
(`@indiecrafts/packages-web-email`).

## One switch

- **`features.newsletter`** (`boolean`, default `true`, app-owned in `@/config`; the module reads it injected) — gates the whole
  feature. Off → the block renders nothing and `/api/newsletter` + `/api/newsletter/confirm` return
  `404`, in lockstep. See [Feature flags](/projects/web/website/config/feature-flags).

There is **no provider config**. The block always stores the subscriber in Sanity; there are no
per-ESP adapters to manage. To use an external service, see [External provider](#external-provider).

## The flow

1. The block posts `{ email, consent, source, honeypot }` to `/api/newsletter`.
2. The route gates on `features.newsletter`, then `subscribe()` (`@indiecrafts/modules-web-newsletter/lib/newsletter`)
   validates: email shape, consent required, honeypot must be empty.
3. Dedupe by email, then `writeClient.create` a `subscriber` (`status: "pending"`, whitelisted
   fields, `_type` hard-coded). `newsletter` records the purpose: `true` for the newsletter block,
   `false` for a lead-magnet block (`source: "lead-magnet"`), whose consent covers the document only.
   - An address that is already **confirmed** is applied at once, with no second email: a newsletter
     sign-up after a lead-magnet-only one adds `newsletter: true` (+ the Resend sync); a lead-magnet
     request gets its document straight away.
   - A **pending** or **unsubscribed** address is re-armed to `pending` with a new link. After an
     unsubscribe, only the new request's own consent counts — a lead magnet never re-subscribes
     anyone to the newsletter.
4. On a **new** subscriber, two **best-effort** emails may fire (see below) — a failure only logs,
   never fails the signup.
5. Response: `201` for a **new or already-known** email — identical body, so membership can't be
   enumerated — `400` invalid, `404` gated off. A honeypot-filled submission also returns `201`, so
   bots learn nothing.

## Emails (Studio → E-mails)

Both are off by default and configured on the shared `emailStrings` entity (owned by
`@indiecrafts/packages-web-email`, Studio → **E-mails**). The email secret is `RESEND_API_KEY` (env, server-only,
never `NEXT_PUBLIC_`); unset → emails are skipped and the signup still works. (Lead magnets add a
second secret — see below.) The `From` must be a
**Resend-verified domain**. Verify delivery with the **Send test** action (Studio → E-mails → ⋯).

- **Confirmation → the subscriber** (`newsletterConfirm`) — the double opt-in email, with **copy
  translated per language** (`subject`, `heading`, `intro`, `buttonLabel`, `outro`) + an optional
  `BCC` (copy an admin on the confirmation). Seeded EN + FR.
- **New-subscriber alert → you** (`newsletterOwner`) — `To`/`CC`/`BCC` (multi-email), `From`, and a
  <code v-pre>{{email}}</code> subject.

### Double opt-in

When the confirmation email is enabled, a new subscriber is stored with a one-time `confirmToken`
and mailed a link to the localized **confirm page** (`/<locale>/newsletter/confirm?token=…`). The
page renders a **Confirm** button; only the button's `POST` flips the subscriber `pending → confirmed`
and **clears the token** (single-use). The link works for **7 days** (`CONFIRM_TOKEN_DAYS`); after
that the page says it expired, and signing up again sends a fresh one. A bare page load never mutates — so a mail scanner or
link-prefetcher (Outlook SafeLinks, etc.) can't auto-confirm. When it's disabled, subscribers simply
stay `pending` (mark them by hand in the desk if you like).

### Lead magnets (gated delivery)

A **`leadMagnet`** doc (Studio) pairs a tag with an uploaded file. Drop a **`module.lead-magnet`**
block instead of the plain newsletter block: on **confirm**, a subscriber whose tags include a magnet
is e-mailed a **signed, expiring download link** (`/api/download` verifies it). This needs a second
secret — **`LEAD_MAGNET_SECRET`** (env, server-only, HMAC signing); without it the download `403`s.
Delivery is best-effort — a failure never blocks the confirmation.

## Resend — one list

The Sanity `subscriber` doc is the source of truth; Resend mirrors it so you send from one place.

- **Confirm → Resend.** On confirm, a newsletter sign-up (not a lead-magnet-only one) is sent to the
  api (`POST /v1/newsletter/subscribers`, `syncNewsletterContact`): the contact is created or updated
  with the global flag `unsubscribed: false` and the **`news` topic** opted in — the topic the
  `emailPreferences` → `news` category points at (its `resendTopicId`). Signed-in members who opt into
  "news" are on the same topic, so a Broadcast to it reaches both.
- **Unsubscribe → Sanity.** A Broadcast carries Resend's unsubscribe link. When someone opts out
  (globally, or from the `news` topic), Resend calls the api webhook (`POST /v1/resend/webhook`,
  Svix-signed with `RESEND_WEBHOOK_SECRET`), which sets the confirmed `subscriber` to `unsubscribed`.
  The webhook never re-confirms anyone: coming back needs the double opt-in again.
- **Not synced:** a status you change by hand in the Studio desk. Unsubscribe people from Resend (or
  let them do it) so both sides agree.
- **Without the api** (`API_URL` / `APP_API_TOKEN` unset) or without `RESEND_API_KEY`, nothing syncs —
  the list stays Sanity-only, as before.
- **Setup per env:** Resend → Webhooks → `https://<api host>/v1/resend/webhook`, events
  `contact.updated`, `contact.deleted`, `contact.topics.updated`; store the signing secret as
  `RESEND_WEBHOOK_SECRET`; set the `news` category's `resendTopicId` in Studio. Details:
  [api](/shared/api/).

## Studio — Abonnés

With `features.newsletter` on, the Studio shows an **Abonnés** desk (mirrors the blog **Commentaires**
desk) with three lists by status — **En attente**, **Confirmés**, **Désabonnés**, newest first.
Subscribers are never editor-created; the desk is read/manage only. A lead-magnet-only sign-up shows
"· document seulement" — it is not a newsletter subscriber.

## Export

Subscribers live in Sanity, so export them any time:

```bash
pnpm export:web:website:subscribers          # who may receive the newsletter
pnpm export:web:website:subscribers --all    # every doc, for an audit — never mail this file
```

The default file holds only **confirmed newsletter subscribers** (`status: "confirmed"` and newsletter
consent) — columns `email, language, source, createdAt`. Pending, unsubscribed and lead-magnet-only
people are never in it. `--all` writes `subscribers-all-<timestamp>.csv` with every doc and its
`status`, `newsletter` and `consent`. Read-only; needs `SANITY_API_READ_TOKEN` (or the write token) in
`.env.local`.

## External provider

To use an external ESP (Mailchimp, ConvertKit, …) instead of storing locally, drop **that service's
own embed form** into a [`custom-html`](/modules/web/blog/body-editor) block. It posts the browser
straight to the provider, so **nothing is stored our side** — the two paths are mutually exclusive by
which block you drop.

One gotcha: the app's Content-Security-Policy blocks cross-origin form submits and third-party
scripts by default. Add the provider's origin to **`EMBED_HOSTS`** in
`code/projects/web/surfaces/website/next.config.ts` so the embed can submit and load:

```ts
const EMBED_HOSTS: string[] = ["https://*.list-manage.com"]; // e.g. Mailchimp
```

It is concatenated into `form-action`, `frame-src`, `script-src`, and `connect-src`. See
[Security headers](/projects/web/website/seo/security-headers).

**Display width.** The `custom-html` block has a **`width`** field — `Contenue` (default, same width as
the other blocks) or `Pleine largeur` for a form/banner that should stretch (it keeps a page gutter, so
content never touches the screen edges). Any embedded `<iframe>` is forced to full width automatically;
a raw `<form>` fills the block, but style your own `<input>`/`<button>` widths in the pasted markup —
provider embeds usually already do.

## GDPR

The consent checkbox is required — the submit button stays disabled until it is ticked, and
`subscribe()` rejects a submission without `consent: true`. The stored `subscriber` records
`consent`, `source` (the page the signup came from), `language`, and `createdAt`. Double opt-in adds
a verified-intent step. No address is stored without an explicit opt-in.

- **Two purposes, two consents.** A lead-magnet sign-up agrees to receive a document, not the
  newsletter: it is stored with `newsletter: false`, never exported, and never added to the Resend
  `news` topic.
- **Erasure** (`/erasure`, a data request) pseudonymises the `subscriber` doc and, with Resend wired,
  deletes the Resend contact (the api's `resend` erasure adapter).

## The block

`module.newsletter` is a page-builder block — droppable inline in a post body or a page's
`postModules`, rendered by the shared `@indiecrafts/packages-web-ui-components` registry (so the app and the blog
paint it identically). Three layout variants — **card**, **inline**, **banner** (a full-width token
band, no image). Every string (heading, body, button, consent, success / error) is
per-instance and per-locale. Renderer + field reference:
[ui-components / Newsletter](/packages/web/ui-components).
