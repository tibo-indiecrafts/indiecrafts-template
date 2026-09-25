---
title: "Comment reply toggle"
description: "Per-comment Reply button that reveals a compact CommentForm threaded under a parent."
status: stable
---

# Comment reply toggle

> A Reply button that opens an inline, compact comment form.

## Purpose

Client component that renders a per-comment "Reply" button. When opened, it reveals a compact `<CommentForm>` that threads under `parentId` (one level deep), plus a Cancel button. Every label is a resolved string from the server `<Comments>`.

## Exports

- `CommentReply` — client component. Props: `postId`, `parentId`, `replyLabel`, `cancelLabel`, and the `CommentForm` label and message strings (`nameLabel`, `emailLabel`, `bodyLabel`, `consentLabel`, `submitLabel`, `successMessage`, `errorMessage`).

## Usage

```tsx
import { CommentReply } from "@indiecrafts/modules-web-blog/user-interface/post/components/CommentReply";

<CommentReply
  postId={post._id}
  parentId={comment._id}
  replyLabel={copy.replyLabel}
  cancelLabel={copy.cancelLabel}
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

`code/modules/web/blog/src/user-interface/post/components/CommentReply.tsx`
