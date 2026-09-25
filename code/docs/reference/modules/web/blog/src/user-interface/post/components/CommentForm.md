---
title: "Comment form"
description: "Client comment form that posts to /api/comments, with honeypot, timing, and Turnstile anti-bot."
status: stable
---

# Comment form

> An i18n-agnostic comment form with layered anti-bot defenses.

## Purpose

Client component that posts a comment to `/api/comments`. Every label is a resolved string passed in by the server `<Comments>` (from the editable `blog.comments` copy). A submitted comment lands unapproved, so on success it shows the "awaiting review" message rather than optimistically inserting. Anti-bot defenses: a hidden `website` honeypot, a `startedAt` timestamp to reject near-instant submits, and an optional Turnstile token.

## Exports

- `CommentForm` — client component. Props: `postId`, optional `parentId` (threads a reply under a parent), optional `compact`, and the label and message strings (`nameLabel`, `emailLabel`, `bodyLabel`, `consentLabel`, `submitLabel`, `successMessage`, `errorMessage`).

## Usage

```tsx
import { CommentForm } from "@indiecrafts/modules-web-blog/user-interface/post/components/CommentForm";

<CommentForm
  postId={post._id}
  nameLabel={copy.nameLabel}
  emailLabel={copy.emailLabel}
  bodyLabel={copy.bodyLabel}
  consentLabel={copy.consentLabel}
  submitLabel={copy.submitLabel}
  successMessage={copy.successMessage}
  errorMessage={copy.errorMessage}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/post/components/CommentForm.tsx`
