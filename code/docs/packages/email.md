# Email (transactional)

The one home for **sending** transactional email, for **every email's layout**, and for the
**translated content entity** that configures them — so all outbound mail is one branded,
mail-client-safe, editor-controlled system. Lives in the **`@indiecrafts/email`** brick
(`code/packages/shared/email`), consumed as source. No SDK — one `fetch` to the Resend REST API.

Extracted from the blog so any module or app can send: modules can't depend on modules, so a second
sender (the newsletter's double opt-in) could never reach a helper stuck in the blog.

## Subpaths

| Import                       | Side   | What it is                                                                                                                                               |
| ---------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@indiecrafts/email`         | pure   | `sendEmail` · `renderEmailLayout` · `escapeHtml` · the `RenderedEmail` render contract (templates live with their feature)                               |
| `@indiecrafts/email/strings` | server | `getEmailStrings()` (React-`cache`d generic read) + `pick(value, locale)` + the `OwnerAlertConfig`/`ConfirmationConfig` read shapes                      |
| `@indiecrafts/email/sanity`  | Studio | `emailSanity(modules)` (builds the singleton) · `confirmationGroup`/`ownerAlertGroup` (group factories) · `sendTestEmailAction` (the "Send test" action) |

## Sending + layout

- `sendEmail(input)` — server-only. `{ from, to[], cc?, bcc?, replyTo?, subject, text, html? }` →
  `POST https://api.resend.com/emails`. Reads `RESEND_API_KEY`. **Throws** on a missing key or
  non-2xx — callers treat sending as best-effort.
- `renderEmailLayout({ title, preheader?, contentHtml, lang? })` — the shared shell: a full,
  table-based, inline-styled document (the only layout technique email clients render reliably).
  `escapeHtml(value)` — escape any user value before it goes in `contentHtml`. Palette hex is inlined
  on purpose (oklch tokens never reach an inbox — same exception as the PWA manifest).
- **Templates live with their owning feature**, not in this brick. Each
  `render…Email(input) => RenderedEmail` (from plain resolved strings) sits in that feature's
  `src/emails/` — `comment-notification` (blog) · `newsletter-confirm`/`newsletter-notification`/
  `lead-magnet` (newsletter) · `waitlist-confirm`/`waitlist-notification` (waitlist) ·
  `data-request-notification` (compliance) — and imports `renderEmailLayout`/`escapeHtml`/
  `RenderedEmail` from `@indiecrafts/email`. The brick owns the shared _system_ (send + layout + the
  render contract + the Sanity group factories) and names **no feature**.

## The E-mails entity (Sanity) — composed per module

`emailSanity(modules)` contributes one **`emailStrings` singleton** (Studio → **E-mails**) — the one
place that configures every transactional email: who receives it, the sender, and the copy. The
document is **field-less on its own**; each module contributes its group(s) via
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

| Group                 | Owner module | To               | Translated? | Extras                        |
| --------------------- | ------------ | ---------------- | ----------- | ----------------------------- |
| `commentNotification` | blog         | site team        | no          | reply-to · moderation buttons |
| `newsletterConfirm`   | newsletter   | subscriber       | **yes**     | button · bcc                  |
| `newsletterOwner`     | newsletter   | site team        | no          | —                             |
| `waitlistConfirm`     | waitlist     | joiner           | **yes**     | bcc                           |
| `waitlistOwner`       | waitlist     | site team        | no          | —                             |
| `dataRequestOwner`    | compliance   | controller / DPO | no          | —                             |

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
   `render<Name>Email(input) => RenderedEmail` — build the HTML via `renderEmailLayout` (imported from
   `@indiecrafts/email`), escape every value. Colocate a `*.test.ts`. No brick edit, no re-export.
3. Call it from the feature: `getEmailStrings()`, narrow to your group (`OwnerAlertConfig` /
   `ConfirmationConfig`), `pick(...)` the locale strings, `sendEmail`.
4. Add the render to `buildSamples` in `code/projects/web/surfaces/website/src/app/api/emails/test/route.ts`
   (importing it from your module) so the "Send test" action covers it.

## BCC — per email, editor-owned

Every group carries its own **BCC** field (the confirmations too). An admin who wants a copy of a
user-facing confirmation adds their address to that email's BCC — there is **no global admin-BCC**.
The confirm engines pass `bcc: clean(cfg?.bcc)` to `sendEmail`; empty stays omitted.

## Verify deliverability — the "Send test" action

Open Studio → **E-mails** → the **⋯ menu → "Envoyer un test"**, enter an address, and the site sends a
sample of **every enabled email** to it — proof that mail leaves the server, the `From` is accepted,
and the branded layout renders in a real inbox.

- **Not a public endpoint.** The action POSTs `/api/emails/test`, gated by `features.studio`, then the
  route verifies the caller's **Sanity session token** against the project's `users/me` — only a
  signed-in editor of this project can trigger a send, so it can't be abused as a spam relay.
- Test sends go **only** to the address you type (real BCC recipients fire on real signups, not on a
  test click). The `RESEND_API_KEY` secret never leaves the server.

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
- **Nothing in `@indiecrafts/config`** — email settings are editor content, not technical rules.
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

- **`@indiecrafts/blog`** — comment-moderation alert (`lib/notify-comment.ts`).
  See [Blog comments → Email notifications](../modules/blog/comments.md).
- **`@indiecrafts/newsletter`** — double opt-in confirmation + new-subscriber alert
  (`lib/newsletter.ts`). See [Newsletter](../modules/newsletter/).
- **`@indiecrafts/waitlist`** — "you're on the list" confirmation + new-entry alert
  (`lib/waitlist.ts`). See [Waitlist](../modules/waitlist/).

## Deps

`@indiecrafts/config` (`site.url`) + `@indiecrafts/sanity` (the read client + `SanityModule`) +
`@sanity/ui` (the "Send test" dialog). The translated fields use the shared
`localeString`/`localeText` primitives from `@indiecrafts/schema`. Never imports an app or a module.
