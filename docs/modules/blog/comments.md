# Blog comments

Moderated, public comments on each blog post — stored in Sanity, approved in the Studio,
with editable per-locale copy and a honeypot spam guard. Gated by
`features.blogComments` (requires `blog`).

## How it works

1. A visitor submits the form under a post → `POST /api/comments`.
2. The route hands it to `createComment` (`@indiecrafts/blog/lib/comments`), which validates,
   whitelists fields, and creates a `comment` document with **`approved: false`** using the
   server-only write client (`@indiecrafts/sanity/write`).
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

All visitor-facing text lives on the **Blog** singleton (Studio → Blog → *Mise en page*),
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

`features.blogComments` (in `@indiecrafts/config`) turns the whole surface on/off — the
`/api/comments` route `404`s and the `<Comments>` section doesn't render when off. Requires
`features.blog`.

## Deployment note

With comments on, **`SANITY_API_WRITE_TOKEN` becomes a runtime dependency** (it was
seed-only) — set it in production. It's Editor-role and server-only (never `NEXT_PUBLIC_`);
prefer a dedicated, independently-rotatable token. See
[`@indiecrafts/sanity`](/packages/sanity) → `./write`.
