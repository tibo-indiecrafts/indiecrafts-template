---
title: "Waitlist"
description: "An editor-droppable early-access signup block (module.waitlist) with a gated API route, a private Studio list, optional confirmation/owner emails, and a CSV export."
status: stable
---

# Waitlist

An editor-droppable early-access signup block (`module.waitlist`) with a gated API route, a private
Studio list, optional confirmation/owner emails, and a CSV export. Works
out of the box with **no API keys** — a signup lands as a Sanity `waitlistEntry` you read in the
Studio. **Collect + export only** — no runtime gating. Modeled on the [newsletter](../newsletter/).

Lives in the **`@indiecrafts/modules-web-waitlist`** module (`code/modules/web/waitlist`): the join engine, the
`waitlistEntry` doc, and an editable **`waitlistSettings`** singleton — a one-line `composeStudio`-group
contribution. The public form stays a page-builder block (renderer in `@indiecrafts/packages-web-ui-components`).

## One switch

- **`features.waitlist`** (`boolean`, default `true`, app-owned in `@/config`; the module reads it injected) — gates the whole
  feature. Off → the block renders nothing and `/api/waitlist` returns `404`, in lockstep.

## The flow

1. The block posts `{ email, name?, consent, source, honeypot }` to `/api/waitlist`.
2. The route gates on `features.waitlist`, then `join()` (`@indiecrafts/modules-web-waitlist/lib/waitlist`)
   validates: email shape, required consent, honeypot must be empty.
3. Dedupe by email, then `writeClient.create` a `waitlistEntry` (`status: "waiting"`, whitelisted
   fields, `_type` hard-coded).
4. On a **new** entry, the person also becomes a **Resend contact on the General topic**
   (`addGeneralContact` → `POST /v1/contacts/general`; the api records the consent proof in D1).
   Best-effort: the Sanity entry is the record. A re-join with a known email sends it again, which
   repairs a join the api could not complete (e.g. before the topic was set up). Setup: `pnpm resend:topics:sync`, then paste the
   `General` topic id into Studio → E-mails → Préférences → category `general`.
5. On a **new** entry, two **best-effort** emails may fire (see below) — a failure only logs, never
   fails the signup.
6. Response: `201` for a **new or already-known** email — identical body, so membership can't be
   enumerated — `400` invalid, `404` gated off. A honeypot-filled submission also returns `201`, so
   bots learn nothing.

## Studio — Liste d'attente

With `features.waitlist` on, the Studio shows a **Liste d'attente** section: the settings singleton +
the entries. An editor reads an entry and changes its status; status sub-lists (**En attente** /
**Invité·e·s**) are read views. The API fills `source`/`language`/`consent`/`createdAt` (read-only).
Entries come **only from the form**: each one gets a dotted id (`private.waitlistEntry.<uuid>`), which
a public dataset hides from anonymous reads. The Studio has no **Create** or **Duplicate** for this type,
because a Studio copy would get a public id. To add someone, use the site's form.

## Emails (Studio → E-mails)

Both off by default, configured on the shared `emailStrings` entity (owned by `@indiecrafts/packages-web-email`).
The only secret is `RESEND_API_KEY` (server-only). The `From` must be a **Resend-verified domain**.
Verify delivery with the **Send test** action (Studio → E-mails → ⋯).

- **Confirmation → the joiner** (`waitlistConfirm`) — a "you're on the list" welcome, **copy
  translated per language** (subject/heading/intro/outro) + an optional `BCC`, seeded EN + FR. No
  confirm-link.
  Sent in the language of the page the form was on; a language the site does not have → the
  default locale.
- **New-entry alert → you** (`waitlistOwner`) — `To`/`CC`/`BCC`, `From`, and a <code v-pre>{{email}}</code>/<code v-pre>{{name}}</code>
  subject.

## Export

```bash
pnpm waitlist:export   # → backups/waitlist/waitlist-<timestamp>.csv
```

Read-only; needs `SANITY_API_READ_TOKEN`. Columns: `email, name, status, source, language, consent,
consentPolicyVersion, createdAt`.

## Two surfaces — a full page **and** a block

The same `WaitlistForm` renders two ways:

- **Full page** — `/waitlist`, a standalone landing with the site header/footer. **All copy is in
  Sanity**: the form copy from the `waitlistSettings` singleton (locale-resolved), the SEO
  title/description from that singleton's own **SEO & visibilité** section (the shared `seoMeta`)
  — nothing in `messages/`. The singleton is locale-independent, so this SEO is a single value,
  not per-locale.
  The **view lives in the module** (`src/user-interface/WaitlistLanding.tsx`); the app route
  (`[locale]/waitlist/page.tsx`) is a thin shell (gate + `DefaultLayout` + SEO). Registered in the
  `pages` map (sitemap + routing), gated by `features.waitlist` **and** the editor `enabled` toggle
  (both 404 it when off; the toggle also hides every waitlist block).
- **Block** — `module.waitlist`, droppable anywhere (see below).

## The block

`module.waitlist` is a page-builder block — droppable inline in a post body or a page's `postModules`,
rendered by the shared `@indiecrafts/packages-web-ui-components` registry. Three variants — **card**, **inline**,
**banner**. The **name** field only shows when a `namePlaceholder` is set. Every string is
per-instance and per-locale. Renderer + field reference:
[ui-components / Waitlist](/packages/web/ui-components).
