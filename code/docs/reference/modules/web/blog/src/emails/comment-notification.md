---
title: "Comment notification email"
description: "Renders the plain-text and HTML new-comment moderation email for the blog."
status: stable
---

# Comment notification email

> The "a comment needs moderation" email — copy, subject, and both bodies.

## Purpose

Builds the transactional email sent to the site team when a reader submits a comment. It owns the subject, the plain-text body, and the branded HTML body. With `actions`, it adds Approve / Spam / Delete buttons that each open a confirm page — the mutation runs on that page's POST, so a link scanner cannot auto-moderate.

## Exports

- `renderCommentNotificationEmail(input)` — returns a `RenderedEmail` (`subject`, `text`, `html`).
- `CommentNotificationInput` — the plain-data input type (author, post, excerpt, optional copy overrides, optional `actions`).

## Usage

```ts
import { renderCommentNotificationEmail } from "@indiecrafts/modules-web-blog/emails/comment-notification";

const { subject, text, html } = renderCommentNotificationEmail({
  author: "Marie",
  postTitle: "Nos ateliers d'été",
  postUrl: "https://example.com/blog/ateliers",
  studioUrl: "https://example.com/studio",
  excerpt: "Superbe article, merci !",
});
```

## Source

`code/modules/web/blog/src/emails/comment-notification.ts`
