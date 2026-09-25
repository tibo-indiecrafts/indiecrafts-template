---
title: "Blog comments"
description: "Moderated, public comments on each blog post — stored in Sanity, approved in the Studio, with editable per-locale copy and a honeypot spam guard."
status: stable
---

# Blog comments

Moderated, public comments on each blog post — stored in Sanity, approved in the Studio,
with editable per-locale copy and a honeypot spam guard. Gated by
`features.blogComments` (requires `blog`).

## How it works

1. A visitor submits the form under a post → `POST /api/comments`.
2. The route hands it to `createComment` (`@indiecrafts/modules-web-blog/lib/comments`), which validates,
   whitelists fields, and creates a `comment` document with **`approved: false`** using the
   server-only write client (`@indiecrafts/packages-web-sanity/write`).
3. The comment is **invisible** until an editor ticks **Approuvé** in the Studio.
4. The post page lists only approved comments (live, via `<SanityLive>`), so an approval
   appears without a redeploy.

Only `approved == true` comments are ever read publicly (one query,
`approvedCommentsQuery`), and `authorEmail` is **never** projected to the site.

## Threading (1 level)

Each top-level comment has a **Reply** button (an inline compact form). A reply carries a
`parent` reference and renders indented under its parent — one level deep. A reply only
attaches when its `parent` is an **approved** comment on the **same post** (verified
server-side); a bad `parentId` is silently stored top-level rather than threading onto
another post. The **Reply** / **Cancel** button labels are part of the editable copy.

## Moderating (Studio)

Studio → **Contenu → Commentaires**:

- **En attente** — the moderation queue (`approved != true`). Open a comment, tick
  **Approuvé** to publish it, or leave it / mark **Spam** to keep it hidden.
- **Approuvés** — everything currently live.

Deleting a comment removes it (GDPR right-to-erasure). Email is stored for moderation only
and never shown.

## Editing the copy (per locale)

All visitor-facing text lives on the **Blog** singleton (Studio → Blog → _Mise en page_),
under **Commentaires — textes** — one input per language (English / Français):
heading, field labels, consent text, submit button, and the success / empty / error
messages. Change the wording without a code deploy. Empty fields fall back to built-in
English defaults.

## Spam & privacy

- **Honeypot** — a hidden `website` field; a bot that fills it gets a normal `201` but the
  comment is dropped silently. (Turnstile + rate-limiting are the planned Phase 2.)
- **Validation** — required name + body + consent, length caps, email format; `_type` is
  hard-coded and the request body is never spread into the mutation.
- **Consent** — the form has a required consent checkbox; the choice is stored on the doc.
- **Email** — optional, private, never displayed or fetched publicly.

## Enabling / disabling

`features.blogComments` (app-owned in `@/config`, injected into the blog via `configureBlog`) turns the whole surface on/off — the
`/api/comments` route `404`s and the `<Comments>` section doesn't render when off. Requires
`features.blog`.

## Deployment note

With comments on, **`SANITY_API_WRITE_TOKEN` becomes a runtime dependency** (it was
seed-only) — set it in production. It's Editor-role and server-only (never `NEXT_PUBLIC_`);
prefer a dedicated, independently-rotatable token. See
[`@indiecrafts/packages-web-sanity`](/packages/web/sanity) → `./write`.

## Email notifications (Resend)

Get an email the moment a comment needs moderation — best-effort, configured in the Studio on the
shared **E-mails** entity (→ **E-mails → commentNotification**); the only secret lives in the env.

- **On/off + recipients — in Sanity.** An `enabled` toggle · **To / CC / BCC**, each accepting
  **multiple addresses** (tag input, each `Rule.email()`-validated) · **From** (must be a
  Resend-verified domain) · **Reply-To** (empty = the commenter's email) · **Subject** with
  <code v-pre>{{author}}</code> / <code v-pre>{{post}}</code> placeholders. (This alert is owner-facing, so its subject is a plain
  string; the visitor-facing newsletter confirmation is translated per language — see
  [Email](/packages/web/email).)
- **The key — in the env.** `RESEND_API_KEY`, server-only (never `NEXT_PUBLIC_`). Unset →
  comments still work; the notification is skipped and logged.
- **Best-effort.** The email is sent after the comment is written; a failure is logged and
  **never** turns a saved comment into an error — the visitor always gets `201`.
- **Only real comments** trigger it (honeypot spam drops before the write). The mail carries the
  author + a body excerpt + the post link + a Studio link to moderate, wrapped in a branded HTML
  layout.
- **Where it lives.** The blog reads the entity in `lib/notify-comment.ts` (`getEmailStrings()`); the
  layout, copy, and Resend sender live in [`@indiecrafts/packages-web-email`](/packages/web/email)
  (`renderCommentNotificationEmail` → `sendEmail`) — no SDK, one server-side `fetch`. Every email
  shares that one layout + entity.

### One-click moderation buttons

The notification email carries **Approuver · Spam · Supprimer** buttons — moderate without opening the
Studio. Toggle them on the entity (`commentNotification.moderationButtons`, default **on**).

- **Safe by design.** A button does **not** mutate on click. It opens a small branded **confirm page**
  (`GET /api/comments/moderate`) showing the comment; a **Confirmer** button **POSTs** the action. So a
  link-scanner or prefetcher (Outlook SafeLinks, etc.) that auto-fetches the link can't approve/delete
  — only a human POST changes state.
- **One-time token.** Each comment carries a single-use `moderationToken` (hidden). Approve →
  `approved: true`; Spam → `spam: true` (leaves the "En attente" queue → the **Spam** desk list);
  Delete → removes the doc. After the action the token is cleared, so the link expires.
- Requires `features.blogComments` + `SANITY_API_WRITE_TOKEN` (the route writes). The token is an
  opaque nonce, not PII.

## Exporting comments

```bash
pnpm comments:export   # → backups/comments/comments-<timestamp>.csv
```

Read-only; needs `SANITY_API_READ_TOKEN`. Columns: `authorName, authorEmail, body, approved, spam,
post, createdAt`. (Owner-only — `authorEmail` is private and never leaves this export / the Studio.)
