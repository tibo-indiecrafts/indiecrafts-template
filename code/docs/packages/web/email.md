---
title: "Email (transactional)"
description: "The one home for sending transactional email, for every email's layout, and for the translated content entity that configures them — so all outbound mail is…"
status: stable
---

# Email (transactional)

The one home for **sending** transactional email, for **every email's layout**, and for the
**translated content entity** that configures them — so all outbound mail is one branded,
mail-client-safe, editor-controlled system. Lives in the **`@indiecrafts/packages-web-email`** brick
(`code/packages/web/email`), consumed as source. No SDK — one `fetch` to the Resend REST API.

Extracted from the blog so any module or app can send: modules can't depend on modules, so a second
sender (the newsletter's double opt-in) could never reach a helper stuck in the blog.

## Subpaths

| Import                                     | Side   | What it is                                                                                                                                                             |
| ------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@indiecrafts/packages-web-email`          | pure   | `sendEmail` · `renderEmail` · `escapeHtml` · the `RenderedEmail` render contract (templates live with their feature)                                                   |
| `@indiecrafts/packages-web-email/strings`  | server | `getEmailStrings()` (React-`cache`d generic read) + `pick(value, locale)` + `supportCopy(cfg, supportEmail)` + the `OwnerAlertConfig`/`ConfirmationConfig` read shapes |
| `@indiecrafts/packages-web-email/contacts` | server | `addGeneralContact(…)` — a waitlist or contact-form person as a Resend contact on the General topic, via `POST /v1/contacts/general`                                   |
| `@indiecrafts/packages-web-email/sanity`   | Studio | `emailSanity(modules)` (builds the singleton) · `confirmationGroup`/`ownerAlertGroup` (group factories) · `sendTestEmailAction` (the "Send test" action)               |

## Sending + layout

- `sendEmail(input)` — server-only. `{ from, to[], cc?, bcc?, replyTo?, subject, text, html? }` →
  `POST https://api.resend.com/emails`. Reads `RESEND_API_KEY`. **Throws** on a missing key or
  non-2xx — callers treat sending as best-effort.
- `renderEmailLayout({ title, preheader?, contentHtml, lang?, supportEmail? })` — internal (not exported): the shared shell, a
  full, table-based, inline-styled document (the only layout technique email clients render reliably).
  `lang` is the recipient's language: it sets `<html lang>` and the footer words (`localeCopy`: the
  language's own, else the default locale's, else English — "Sent by …" / "Need help? …").
- `renderEmail({ subject, text, …layout })` — how every template finishes: the shell above plus the
  plain-text body, **both** ending with the support line. Return through it, never build `html`
  alone, so neither copy of an email can miss the support address.
  `escapeHtml(value)` — escape any user value before it goes in `contentHtml`. Palette hex is inlined
  on purpose (oklch tokens never reach an inbox — same exception as the PWA manifest).
- **Templates live with their owning feature**, not in this brick. Each
  `render…Email(input) => RenderedEmail` (from plain resolved strings) sits in that feature's
  `src/emails/` — `comment-notification` (blog) · `newsletter-confirm`/`newsletter-notification`/
  `lead-magnet` (newsletter) · `waitlist-confirm`/`waitlist-notification` (waitlist) ·
  `data-request-notification` (compliance) — and imports `renderEmail`/`escapeHtml`/
  `RenderedEmail` from `@indiecrafts/packages-web-email`. The brick owns the shared _system_ (send + layout + the
  render contract + the Sanity group factories) and names **no feature**.

## The E-mails entity (Sanity) — composed per module

`emailSanity(modules)` contributes one **`emailStrings` singleton** (Studio → **E-mails**) — the one
place that configures every transactional email: who receives it, the sender, and the copy. Its only
built-in field is a global **`supportEmail`** (the editor-owned support address shown in every email
footer, in the HTML and the plain text, in the recipient's language). **It is the on/off switch:** set
it in Studio → E-mails → "Adresse de support" and every email carries `Need help? <address>` (website
emails, the Studio test samples, and the api worker's erasure, data-request and Clerk emails); leave it
empty and no email shows a support line. The internal security alert carries it too (in English, like
its body). A second built-in is **`bccAll`** — a QA global blind-copy address that receives a copy of
**every** transactional email (all surfaces + the Clerk take-over + the erasure emails), merged into
`bcc` alongside the `EMAIL_ADMIN_BCC` env value and any per-group bcc. Because it copies auth codes and
magic links, it is **infra-gated**: honored only when the runtime env flag `EMAIL_BCC_ALL_ENABLED` is set
(on in dev, off in prod), so a Studio editor alone can't turn it into an auth-bypass channel. The worker
reads the flag from its wrangler `[env.dev.vars]`; a Next surface reads `process.env.EMAIL_BCC_ALL_ENABLED`.
The rest is **composed from modules** — each contributes its group(s) via
`SanityModule.emailGroups`, and `emailSanity` composes them into the one document. **The brick never
names a module** — remove a module from the `composeStudio` groups and its email group disappears.

Two group factories cover every email:

- `confirmationGroup({ … })` — a **subscriber-facing** email; copy is translated
  (`localeString`/`localeText`, resolved by the recipient's locale via `pick`). Ships
  enabled · from · reply-to · **bcc** · subject · heading · intro · (buttonLabel) · outro.
- `ownerAlertGroup({ … })` — an **internal** alert to the site team. Ships enabled · to/cc/bcc ·
  from · (reply-to) · plain subject · **translated heading · intro · outro** · (moderation buttons).
  The body copy is optional — empty falls back to the template default (sent in the default locale),
  so an untranslated alert still works; fill it only to customise. Every owner alert is now fully
  editable, not just its recipients + subject.

Groups today:

| Group                 | Owner module            | To               | Translated? | Extras                           |
| --------------------- | ----------------------- | ---------------- | ----------- | -------------------------------- |
| `commentNotification` | blog                    | site team        | no          | reply-to · moderation buttons    |
| `newsletterConfirm`   | newsletter              | subscriber       | **yes**     | button · bcc                     |
| `leadMagnetConfirm`   | newsletter              | visitor          | **yes**     | button (copy only)               |
| `leadMagnet`          | newsletter              | visitor          | **yes**     | button (the download link) · bcc |
| `newsletterOwner`     | newsletter              | site team        | no          | —                                |
| `waitlistConfirm`     | waitlist                | joiner           | **yes**     | bcc · support copy               |
| `waitlistOwner`       | waitlist                | site team        | no          | —                                |
| `contactConfirm`      | contact                 | sender           | **yes**     | bcc · support copy               |
| `contactOwner`        | contact                 | site team        | no          | reply-to = the sender            |
| `dataRequestOwner`    | compliance              | controller / DPO | no          | —                                |
| `erasureToken`        | compliance (api worker) | requester        | **yes**     | —                                |
| `erasureComplete`     | compliance (api worker) | requester        | **yes**     | —                                |
| `dataRequestReceipt`  | compliance (api worker) | requester        | **yes**     | support copy                     |
| `dataRequestClosed`   | compliance (api worker) | requester        | **yes**     | support copy                     |
| `securityAlert`       | the brick               | site team        | no          | no on/off; plain text            |

A sender reads the whole entity once (`getEmailStrings()` — a **generic read**, no field projection,
so a feature adding a group never edits this brick), **narrows to its own group** with the exported
`OwnerAlertConfig`/`ConfirmationConfig` shapes, resolves the locale strings, and passes them to the
matching template. Seeded EN + FR by `pnpm seed`. **Order in the Studio = module order** in the
`composeStudio` groups.

## Adding an email

1. In the owning module, add a group with a factory in `src/sanity/email.ts` and export it as
   `emailGroups` (the module's `SanityModule` barrel spreads it in). Reuse `confirmationGroup` /
   `ownerAlertGroup`; a genuinely new shape earns a new factory here, not a per-module one-off.
2. In the **same module**, add `src/emails/<name>.ts` exporting
   `render<Name>Email(input) => RenderedEmail` — return through `renderEmail` (imported from
   `@indiecrafts/packages-web-email`) with the recipient's `lang` and the `supportEmail`; escape every
   value. Colocate a `*.test.ts`. No brick edit, no re-export.
3. Call it from the feature: `getEmailStrings()`, narrow to your group (`OwnerAlertConfig` /
   `ConfirmationConfig`), `pick(...)` the locale strings, `sendEmail`. A visitor's email uses the page
   language the form sent, through `toSiteLocale` (anything else → `defaultLocale`); an owner alert
   uses `defaultLocale`.
4. Add the render, with `supportEmail`, to `buildSamples` in `code/projects/web/surfaces/website/src/app/api/emails/test/samples.ts`
   (importing it from your module) so the "Send test" action covers it. An email the api worker
   sends goes in its `code/shared/api/src/email-test/send.ts` instead (the service or account group).

## BCC — per email, editor-owned

Every group carries its own **BCC** field (the confirmations too). An admin who wants a copy of a
user-facing confirmation adds their address to that email's BCC — there is **no global admin-BCC**.
The confirm engines pass `bcc: clean(cfg?.bcc)` to `sendEmail`; empty stays omitted.

## Copy to the support address — a checkbox per email

A group built with `confirmationGroup({ …, copySupport: true })` shows **"Copie cachée à l'adresse
de support"**. Ticked, the support address (E-mails → "Adresse de support") gets a blind copy of
each send. The website senders spread `supportCopy(cfg, supportEmail)` into `bcc`; the api worker
passes `supportCopy` to `resend()` (`supportCopyOf`, and `authSupportCopy` for Clerk).

- **Offered on:** `contactConfirm` · `waitlistConfirm` · `dataRequestReceipt` ·
  `dataRequestClosed` · the Clerk notices (password, passkey, two-step, primary email, account
  locked) · `welcome`.
- **Never offered** (the default): an email that carries a one-time code or action link —
  `newsletterConfirm` · `leadMagnetConfirm` · `leadMagnet` (a signed download link) ·
  `erasureToken` · Clerk codes, magic link, invitation, new device. A copy would hand that access
  to whoever reads the support inbox. The Clerk worker also keeps a fixed list, so a value written
  outside the Studio cannot copy one either. `erasureComplete` never copies either: the copy would
  keep the erased person's data in the support inbox.
- **Not gated** like `bccAll`. The trade-off: the support address is a Studio field, so an editor
  who changes it redirects the copies. It is the address every footer shows, so the change is
  visible in each email, and the copied emails carry no code or one-time link.

## Verify deliverability — the "Send test" action

Open Studio → **E-mails** (or **E-mails Clerk**) → the **⋯ menu → "Envoyer un test"**, pick a group
and a language, enter an address, and a sample of **every enabled email of that group** goes to it —
proof that mail leaves the server, the `From` is accepted, and the branded layout renders in a real
inbox. One group per test, so it never floods the inbox:

| Group              | Emails                                                                            | Built by       |
| ------------------ | --------------------------------------------------------------------------------- | -------------- |
| E-mails du site    | contact, waitlist, newsletter, lead magnet, the team alerts                       | the website    |
| E-mails de service | erasure link + completion, data-request receipt + closing                         | the api worker |
| E-mails de compte  | the 12 Clerk emails (codes, sign-in link, security notices, invitation) + welcome | the api worker |

Each sample goes through the real sender with the real Studio copy, footer and language; only the
data is a sample (reference `#0`, code `000000`, links with no valid token). A visitor email goes once
per chosen language, a team alert once. The service and account samples come from
`POST /v1/emails/test` on the api, which the website calls with `APP_API_TOKEN`.

- **Not a public endpoint.** The action POSTs `/api/emails/test`, gated by `features.studio`, then the
  route verifies the caller's **Sanity session token** against the project's `users/me` — only a
  signed-in editor of this project can trigger a send, so it can't be abused as a spam relay.
- Test sends go **only** to the address you type: never the support copy, never the QA `bccAll`
  (real copies fire on real sends, not on a test click). The `RESEND_API_KEY` secret never leaves the
  server.

## Landing in the inbox (not spam)

Resend delivers, but the receiving side decides "inbox vs spam" from your DNS + `From`:

1. **Verify the sending domain in Resend** and publish the DNS records it gives you — **SPF** +
   **DKIM** (both required for the inbox).
2. Add a **DMARC** record (`v=DMARC1; p=none; rua=…` to start) — many providers now down-rank mail
   with no DMARC.
3. Every group's `From` must be **on that verified domain** (e.g. `bonjour@votre-domaine.com`). An
   unverified From bounces or lands in spam.
4. Set a real, monitored `Reply-To`.
5. Ship both `text` **and** `html` (the templates already do) — text-less HTML looks spammy.

Common "went to spam" causes: no DKIM, a `From` domain that isn't verified, or a link-only body. Run
the **Send test** action after any DNS or `From` change.

## Where email config lives (config placement)

- **Recipients · from · reply-to · BCC · copy · on/off toggles → Sanity** (the E-mails entity).
  Editor-owned, no deploy, translated where visitor-facing.
- **`RESEND_API_KEY` → env** (server-only, never `NEXT_PUBLIC_`). The one secret.
- **Nothing in `@indiecrafts/packages-shared-config`** — email settings are editor content, not technical rules.
- **Per module → compose.** Each module owns its group (`emailGroups`); the brick stays generic. A
  second app that mounts only some modules gets only those emails — no coupling.

## The key

`RESEND_API_KEY` — **server-only**, never `NEXT_PUBLIC_`. Paste it into `.env.local` (never
committed). Unset → every email is skipped, features still work.

**Reusing the template per client:** one key = one **shared** Resend account — shared sending quota,
logs, and verified-domain list across every client. The per-site `From` (in Sanity) keeps sender
addresses right, but does **not** separate accounts. For real isolation, give each client its **own**
Resend account/key.

## Consumers

- **`@indiecrafts/modules-web-blog`** — comment-moderation alert (`lib/notify-comment.ts`).
  See [Blog comments → Email notifications](/modules/web/blog/comments).
- **`@indiecrafts/modules-web-newsletter`** — double opt-in confirmation + new-subscriber alert
  (`lib/newsletter.ts`). See [Newsletter](/modules/web/newsletter/).
- **`@indiecrafts/modules-web-waitlist`** — "you're on the list" confirmation + new-entry alert
  (`lib/waitlist.ts`). See [Waitlist](/modules/web/waitlist/).

## Deps

`@indiecrafts/packages-shared-config` (`site.url`) + `@indiecrafts/packages-web-sanity` (the read client + `SanityModule`) +
`@sanity/ui` (the "Send test" dialog). The translated fields use the shared
`localeString`/`localeText` primitives from `@indiecrafts/packages-web-schema`. Never imports an app or a module.
