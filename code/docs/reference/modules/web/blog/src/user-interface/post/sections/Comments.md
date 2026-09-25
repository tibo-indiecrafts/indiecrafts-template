---
title: "Comments section"
description: "The approved comment thread and comment form rendered under a post."
status: stable
---

# Comments section

> One-level threaded list of approved comments, plus the reply and post-comment forms.

## Purpose

`Comments` fetches the approved comments for a post (`approvedCommentsQuery`, live), groups them into one level of threading (top-level roots plus replies keyed by `parentId`), and renders them above the `CommentForm`. All chrome copy comes from the editable `blog.comments` object resolved for the active locale, with English strings as last-resort fallbacks. Each root also renders a `CommentReply` toggle.

## Exports

- `Comments` — async server component; takes `postId` (string), `locale` (`Locale`), and optional `copy` (`CommentsCopy`).

## Usage

```tsx
import { Comments } from "@indiecrafts/modules-web-blog/user-interface/post/sections/Comments";

<Comments postId={post._id} locale={locale} copy={blog.comments} />;
```

## Source

`code/modules/web/blog/src/user-interface/post/sections/Comments.tsx`
