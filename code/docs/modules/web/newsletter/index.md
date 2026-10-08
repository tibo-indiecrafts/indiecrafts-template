---
title: "Newsletter capture"
description: "An editor-droppable email capture block (module.newsletter) with a gated API route, a signed double opt-in, and Resend as the only subscriber list — one segment per language."
status: stable
---

# Newsletter capture

An editor-droppable email capture block (`module.newsletter`) with a gated API route and a
**double opt-in**. **Resend is the only subscriber list**: nothing is stored when someone signs up;
their confirm click makes them a Resend contact on the **`news` topic** — the same topic signed-in
members opt into — with their language, so each issue goes to the right people.

Lives in the **`@indiecrafts/modules-web-newsletter`** module (`code/modules/web/newsletter`): the
sign-up and confirm engine, the lead magnets, and an editable **`newsletterSettings`** singleton —
shipped as a one-line `composeStudio`-group contribution. The public form stays a page-builder block
(renderer in `@indiecrafts/packages-web-ui-components`). The emails' config + copy live on the shared
**E-mails** entity (`@indiecrafts/packages-web-email`). The api (`@indiecrafts/shared-api`) owns the
Resend contact and the consent proof.

## One switch

- **`features.newsletter`** (`boolean`, default `true`, app-owned in `@/config`; the module reads it injected) — gates the whole
  feature. Off → the block renders nothing and `/api/newsletter` + `/api/newsletter/confirm` return
  `404`, in lockstep. See [Feature flags](/projects/web/website/config/feature-flags).

There is **no provider config**: Resend is the list. To use an external service instead, see
[External provider](#external-provider).

## What it needs

| Piece                                                    | Where                                                                                      | Without it                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `NEWSLETTER_SECRET`                                      | website env, server-only                                                                   | the form answers `503`                                       |
| `RESEND_API_KEY`                                         | website env + api secret                                                                   | the form answers `503`                                       |
| The confirmation email, enabled with a verified `From`   | Studio → E-mails → newsletter confirmation                                                 | the form answers `503`                                       |
| `API_URL` + `APP_API_TOKEN`                              | website env                                                                                | the form answers `503` (a lead-magnet request still works)   |
| `GDPR_FINGERPRINT_SALT` + main D1                        | api                                                                                        | confirm answers `error` (nothing stored)                     |
| The `locale` contact property                            | Resend, via `pnpm resend:topics:sync`                                                      | confirm answers `error` (Resend refuses an unknown property) |
| The `news` topic id + the `newsletter-<locale>` segments | Resend, via `pnpm resend:topics:sync`, then the topic id in Studio → E-mails → Préférences | the contact is stored without them                           |

A missing piece fails loudly — the visitor sees an error — instead of accepting a sign-up that
could never be stored.

## The flow

1. The block posts `{ email, consent, source, language, honeypot }` to `/api/newsletter`.
2. The route gates on `features.newsletter`, then `subscribe()` (`@indiecrafts/modules-web-newsletter/lib/newsletter`)
   validates: email shape, consent required, honeypot empty, not a near-instant submit.
3. **Nothing is stored.** `subscribe()` signs the sign-up — address, language, purpose, tags, source,
   policy version, issue time — with `NEWSLETTER_SECRET` and emails the link in the visitor's language.
   `newsletter` records the purpose: `false` for a lead-magnet block (`source: "lead-magnet"`), whose
   consent covers the document only.
4. Response: `201` for every real sign-up — also an address that is already subscribed, so
   membership can't be enumerated — `400` invalid, `503` setup missing, `404` gated off. A
   honeypot-filled submission also returns `201`, so bots learn nothing.
5. The visitor taps **Confirm** on the link's page (below). A newsletter sign-up becomes a Resend
   subscriber; a lead magnet is e-mailed; you get the owner alert.

## Emails (Studio → E-mails)

Configured on the shared `emailStrings` entity (owned by `@indiecrafts/packages-web-email`,
Studio → **E-mails**). The `From` must be a **Resend-verified domain**. Verify delivery with the
**Send test** action (Studio → E-mails → ⋯).

- **Confirmation → the subscriber** (`newsletterConfirm`, **required**) — the double opt-in email,
  with **copy translated per language** (`subject`, `heading`, `intro`, `buttonLabel`, `outro`) + an
  optional `BCC`. Seeded EN + FR; an empty field falls back to English or French.
- **Confirmed-subscriber alert → you** (`newsletterOwner`, optional) — `To`/`CC`/`BCC`, `From`, and a
  <code v-pre>{{email}}</code> subject. Sent on confirm, in the site's default language, with the
  subscriber's language and source.

### Double opt-in

The email links to the localized **confirm page** with the signed token in the URL **fragment**:
`/<locale>/newsletter/confirm#t=…`. Browsers never send a fragment to a server, so the address in the
token stays out of request logs. The page reads the token, drops it from the address bar and shows a
**Confirm** button; only the button's `POST` to `/api/newsletter/confirm` confirms. A bare page load
never does, so a mail scanner or link prefetcher (Outlook SafeLinks, …) can't confirm anyone.

The link works for **7 days** (`CONFIRM_TOKEN_DAYS`); after that the page says it expired, and
signing up again sends a fresh one. It is not single-use: tapping it again re-applies the same
consent (the api keeps one proof row per link). When the api can't store the subscriber, the page
says so and keeps the button, so the visitor can try again.

### Lead magnets (gated delivery)

A **`leadMagnet`** doc (Studio) pairs a tag with an uploaded file. Drop a **`module.lead-magnet`**
block instead of the plain newsletter block: on **confirm**, the request's tags are checked and each
magnet is e-mailed as a **signed, expiring download link** (`/api/download` verifies it, signed with
the same `NEWSLETTER_SECRET`). A lead-magnet request never subscribes anyone to the newsletter.
Delivery is best-effort — a failure never blocks the confirmation.

## Resend — the only list

On confirm, the website calls the api (`POST /v1/newsletter/subscribers`), which:

1. writes the **consent proof** to the main D1 `consent_events` table — a `visitor` row keyed by the
   email's salted fingerprint (never the address), `consent_type: newsletter`, the policy version and
   the time the link was issued;
2. creates or updates the **Resend contact**: `unsubscribed: false`, the **`news` topic** opted in
   (the topic the `emailPreferences` → `news` category points at), and the **`locale` property**;
3. puts the contact in the **`newsletter-<locale>` segment** and takes it out of the other languages'.

Signed-in members who opt into "news" from their preferences get the same topic, property and
segment. **Send an issue per language**: a Broadcast to `newsletter-fr` with the `news` topic reaches
every French subscriber. Unsubscribing is Resend's own link in the Broadcast — nothing to sync back.

**Setup per env:** run `pnpm resend:topics:sync` once (it creates the topics, the `locale` property
and one `newsletter-<locale>` segment per site language), then paste the `news` topic id into Studio
→ E-mails → Préférences. Details: [api](/shared/api/).

## Where subscribers live

In **Resend** (Audience → Contacts, filtered by segment or topic). There is no Studio desk: the list
lives where you send from.

## Export

```bash
pnpm export:web:website:subscribers          # every subscribed contact, per language
pnpm export:web:website:subscribers --all    # also the unsubscribed ones, for an audit
```

The file lists the `newsletter-<locale>` segments' contacts — columns `email, locale, unsubscribed,
created_at`. Read-only; needs `RESEND_API_KEY` in `.env.local`. Resend data is not in the R2 backups,
so keep an export if you need an offline copy.

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
`subscribe()` rejects a submission without `consent: true`. Nothing is stored before the visitor
confirms from their own inbox. The consent proof (D1 `consent_events`) records the policy version,
the time and the country — never the address, only its salted fingerprint.

- **Two purposes, two consents.** A lead-magnet sign-up agrees to receive a document, not the
  newsletter: it is never added to Resend.
- **Erasure** (`/erasure`, a data request) deletes the Resend contact (the api's `resend` erasure
  adapter) and erases the consent rows by fingerprint. A data export includes the Resend contact.

## The block

`module.newsletter` is a page-builder block — droppable inline in a post body or a page's
`postModules`, rendered by the shared `@indiecrafts/packages-web-ui-components` registry (so the app and the blog
paint it identically). Three layout variants — **card**, **inline**, **banner** (a full-width token
band, no image). Every string (heading, body, button, consent, success / error) is
per-instance and per-locale. Renderer + field reference:
[ui-components / Newsletter](/packages/web/ui-components).
