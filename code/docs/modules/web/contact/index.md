---
title: "Contact"
description: "An editor-droppable contact form (module.contact) with a gated API route, a Studio inbox of received messages, and two emails — an acknowledgement to the sen…"
status: stable
---

# Contact

An editor-droppable contact form (`module.contact`) with a gated API route, a Studio inbox of
received messages, and two emails — an acknowledgement to the sender and an alert to the team that
carries the message. Works out of the box with **no API keys** — a submission lands as a Sanity
`contactMessage` you read in the Studio; add `RESEND_API_KEY` to also send the emails. Modeled on the
[waitlist](../waitlist/).

Lives in the **`@indiecrafts/modules-web-contact`** module (`code/modules/web/contact`): the submit engine, the
`contactMessage` doc, and an editable **`contactSettings`** singleton — a one-line `composeStudio`-group
contribution. The public form stays a page-builder block (renderer in `@indiecrafts/packages-web-ui-components`).

## One switch

- **`features.contact`** (`boolean`, default `true`, app-owned in `@/config`; the module reads it injected) — gates the whole
  feature. Off → the block renders nothing, the `/contact` page 404s, and `/api/contact` returns `404`, in lockstep.

## The flow

1. The block posts `{ email, message, name?, subject?, consent, source, honeypot }` to `/api/contact`.
2. The route gates on `features.contact`, then `submit()` (`@indiecrafts/modules-web-contact/lib/contact`)
   validates: email shape, non-empty message, required consent, honeypot must be empty.
3. `writeClient.create` a `contactMessage` (`status: "new"`, whitelisted fields, `_type` hard-coded).
   No dedupe — a person may write more than once.
4. Two **best-effort** emails may fire (see below) — a failure only logs, never fails the submission.
5. Response: `201` on success, `400` invalid, `404` gated off. A honeypot-filled submission also
   returns `201`, so bots learn nothing.

## Studio — Contact

With `features.contact` on, the Studio shows a **Contact** section: the settings singleton + the
messages. The **"Tous"** list is the inbox (read-only — messages arrive via the API, never created by
hand); status sub-lists (**Nouveaux** / **Traités**) are filtered views. `status` is the one editable
field — move a message to **Traité** once you have replied.

**Delete** — select one or more messages in a Studio list and use the built-in **Delete**; the same
path as every other stored entity (subscribers, waitlist entries, comments). No special action needed.

## Export

```bash
pnpm contact:export   # → backups/contact/contact-<timestamp>.csv
```

Read-only; needs `SANITY_API_READ_TOKEN`. Columns: `email, name, subject, message, status, source,
language, consent, consentPolicyVersion, createdAt`. Same escape hatch as `waitlist:export` /
`export:web:website:subscribers` — every stored entity exports the same way.

## Activation + navigation

`features.contact` (code, `@/config`) is the master switch; the Studio `contactSettings.enabled` toggle
is a **live** switch (no deploy): off → the `/contact` page 404s **and** `/api/contact` refuses
submissions, in lockstep. (The block still renders on any page it was dropped into — gate it by the
code flag, like every block.) Once activated, `/contact` **auto-appears in the navigation editor**
(Studio → Navigation → a menu link's "Page du site" dropdown), because that dropdown is built from the
`pages` map filtered to enabled routes — the generic pattern every page follows.

## Emails (Studio → E-mails)

Both off by default, configured on the shared `emailStrings` entity (owned by `@indiecrafts/packages-web-email`).
The only secret is `RESEND_API_KEY` (server-only). The `From` must be a **Resend-verified domain**.
Verify delivery with the **Send test** action (Studio → E-mails → ⋯).

- **Acknowledgement → the sender** (`contactConfirm`) — a "we got your message" reply, **copy
  translated per language** (subject/heading/intro/outro) + an optional `BCC`. No link.
  Sent in the language of the page the form was on; a language the site does not have → the
  default locale.
- **New-message alert → you** (`contactOwner`) — `To`/`CC`/`BCC`, `From`, and a
  <code v-pre>{{email}}</code>/<code v-pre>{{name}}</code>/<code v-pre>{{subject}}</code> subject. The alert **carries the message body** and sets
  `reply-to` to the sender, so hitting Reply answers the person.

## Two surfaces — a full page **and** a block

The same `ContactForm` renders two ways:

- **Full page** — `/contact`, a standalone landing with the site header/footer. **All copy is in
  Sanity**: the form copy from the `contactSettings` singleton (locale-resolved), the SEO
  title/description from that singleton's own **SEO & visibilité** section (the shared `seoMeta`)
  — nothing in `messages/`. The **view lives in the module**
  (`src/user-interface/ContactLanding.tsx`); the app route (`[locale]/contact/page.tsx`) is a thin
  shell (gate + `DefaultLayout` + SEO). Registered in the `pages` map (sitemap + routing), gated by
  `features.contact` **and** the editor `enabled` toggle (both 404 it when off).
- **Block** — `module.contact`, droppable anywhere (see below).

## The block

`module.contact` is a page-builder block — droppable inline in a post body or a page's `postModules`,
rendered by the shared `@indiecrafts/packages-web-ui-components` registry. Two variants — **card** and **banner**.
The **name** and **subject** fields only show when their placeholder is set; the **message** textarea
is always present. Every string is per-instance and per-locale. Renderer + field reference:
[ui-components / Contact](/packages/web/ui-components).
