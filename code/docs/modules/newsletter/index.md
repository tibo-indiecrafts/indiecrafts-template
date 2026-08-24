# Newsletter capture

An editor-droppable email capture block (`module.newsletter`) with a gated API route, a Studio
subscriber desk, optional **double opt-in** + owner-alert emails, and a CSV export. Works out of the
box with **no API keys** — a signup lands as a Sanity `subscriber` document you read in the Studio.

Lives in the **`@indiecrafts/modules-web-newsletter`** module (`code/modules/web/newsletter`): the subscribe
engine, the `subscriber` doc, and an editable **`newsletterSettings`** singleton — shipped as a
one-line `composeStudio`-group contribution. The public form stays a page-builder block (renderer in
`@indiecrafts/packages-web-ui-components`). The emails' config + copy live on the shared **E-mails** entity
(`@indiecrafts/packages-web-email`).

## One switch

- **`features.newsletter`** (`boolean`, default `true`, app-owned in `@/config`; the module reads it injected) — gates the whole
  feature. Off → the block renders nothing and `/api/newsletter` + `/api/newsletter/confirm` return
  `404`, in lockstep. See [Feature flags](../../apps/web/config/feature-flags.md).

There is **no provider config**. The block always stores the subscriber in Sanity; there are no
per-ESP adapters to manage. To use an external service, see [External provider](#external-provider).

## The flow

1. The block posts `{ email, consent, source, honeypot }` to `/api/newsletter`.
2. The route gates on `features.newsletter`, then `subscribe()` (`@indiecrafts/modules-web-newsletter/lib/newsletter`)
   validates: email shape, consent required, honeypot must be empty.
3. Dedupe by email, then `writeClient.create` a `subscriber` (`status: "pending"`, whitelisted
   fields, `_type` hard-coded).
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
  `{{email}}` subject.

### Double opt-in

When the confirmation email is enabled, a new subscriber is stored with a one-time `confirmToken`
and mailed a link to the localized **confirm page** (`/<locale>/newsletter/confirm?token=…`). The
page renders a **Confirm** button; only the button's `POST` flips the subscriber `pending → confirmed`
and **clears the token** (single-use). A bare page load never mutates — so a mail scanner or
link-prefetcher (Outlook SafeLinks, etc.) can't auto-confirm. When it's disabled, subscribers simply
stay `pending` (mark them by hand in the desk if you like).

### Lead magnets (gated delivery)

A **`leadMagnet`** doc (Studio) pairs a tag with an uploaded file. Drop a **`module.lead-magnet`**
block instead of the plain newsletter block: on **confirm**, a subscriber whose tags include a magnet
is e-mailed a **signed, expiring download link** (`/api/download` verifies it). This needs a second
secret — **`LEAD_MAGNET_SECRET`** (env, server-only, HMAC signing); without it the download `403`s.
Delivery is best-effort — a failure never blocks the confirmation.

## Studio — Abonnés

With `features.newsletter` on, the Studio shows an **Abonnés** desk (mirrors the blog **Commentaires**
desk) with three lists by status — **En attente**, **Confirmés**, **Désabonnés**, newest first.
Subscribers are never editor-created; the desk is read/manage only.

## Export

Subscribers live in Sanity, so export them any time:

```bash
pnpm export:web:website:subscribers   # → backups/subscribers/subscribers-<timestamp>.csv
```

Read-only; needs `SANITY_API_READ_TOKEN` (or the write token) in `.env.local`. Columns:
`email, status, consent, source, language, createdAt`.

## External provider

To use an external ESP (Mailchimp, ConvertKit, …) instead of storing locally, drop **that service's
own embed form** into a [`custom-html`](/modules/blog/body-editor) block. It posts the browser
straight to the provider, so **nothing is stored our side** — the two paths are mutually exclusive by
which block you drop.

One gotcha: the app's Content-Security-Policy blocks cross-origin form submits and third-party
scripts by default. Add the provider's origin to **`EMBED_HOSTS`** in
`code/projects/web/surfaces/website/next.config.ts` so the embed can submit and load:

```ts
const EMBED_HOSTS: string[] = ["https://*.list-manage.com"]; // e.g. Mailchimp
```

It is concatenated into `form-action`, `frame-src`, `script-src`, and `connect-src`. See
[Security headers](../../apps/web/seo/security-headers.md).

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

## The block

`module.newsletter` is a page-builder block — droppable inline in a post body or a page's
`postModules`, rendered by the shared `@indiecrafts/packages-web-ui-components` registry (so the app and the blog
paint it identically). Three layout variants — **card**, **inline**, **banner** (a full-width token
band, no image). Every string (heading, body, button, consent, success / error) is
per-instance and per-locale. Renderer + field reference:
[ui-components / Newsletter](/packages/ui-components).
