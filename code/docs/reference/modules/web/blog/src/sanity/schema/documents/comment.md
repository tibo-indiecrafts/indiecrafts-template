---
title: "Comment schema"
description: "Sanity document for a public, moderated blog comment — approval flag, private author email, consent proof, spam flag, and moderation token."
status: stable
---

# Comment schema

> The Sanity document that stores a public blog comment.

## Purpose

Defines the `comment` document type. Comments are created server-side through the `/api/comments` route with `approved: false`, so they appear on the site only after an editor ticks **Approuvé**. `authorEmail` is stored for moderation and never projected to the public site. It records GDPR consent (`consent`, `consentPolicyVersion`), a `spam` flag, an optional `parent` reference for replies, and a one-time `moderationToken` used by the email moderation buttons. It is hidden from omnisearch and the global create menu.

## Exports

- `default` — the `comment` Sanity document schema definition.

## Usage

```ts
import comment from "@indiecrafts/modules-web-blog/sanity/schema/documents/comment";
// Registered in sanity/schema/index.ts; moderated from the "Commentaires" desk section.
```

## Source

`code/modules/web/blog/src/sanity/schema/documents/comment.ts`
