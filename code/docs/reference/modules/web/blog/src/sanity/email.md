---
title: "Comment email group"
description: "Defines the blog's comment-notification group on the shared emailStrings singleton."
status: stable
---

# Comment email group

> The blog's field group on the shared `emailStrings` singleton.

## Purpose

Contributes the new-comment alert's config and copy to the shared `emailStrings` singleton, with optional in-email moderation buttons. It is contributed via `blogSanity.emailGroups` and read at send time as `getEmailStrings()?.commentNotification`.

## Exports

- `emailGroups` — an array holding the one `commentNotification` owner-alert group.

## Usage

```ts
import { emailGroups } from "@indiecrafts/modules-web-blog/sanity/email";
```

## Source

`code/modules/web/blog/src/sanity/email.ts`
