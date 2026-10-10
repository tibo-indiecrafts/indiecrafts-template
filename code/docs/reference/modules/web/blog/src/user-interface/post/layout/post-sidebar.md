---
title: "Post sidebar builder"
description: "Builds a post's sidebar node and its mobile-TOC flag from the resolved sidebar cards."
status: stable
---

# Post sidebar builder

> Resolved cards in, a `PostSidebar` for either post layout out.

## Purpose

`postSidebar` turns the resolved sidebar cards of a post into what the post layouts need. GROQ already drops the hidden cards. It drops the TOC card when the post has no heading. It drops the related card when there is no related post. So an empty card does not keep an empty column. It renders the rest through `Modules` with `sidebar: true` and the `related` posts, so each card sits in a `SidebarCard`. With no visible card, `aside` is `undefined` and the body takes the full width. `mobileToc` is `true` when the cards hold a `module.blog-toc` and the post has headings. Then the layout shows the table of contents above the body on a phone.

## Exports

- `PostSidebar` — type: `{ aside?: React.ReactNode; mobileToc: boolean }`.
- `postSidebar(cards, post, locale, related)` — returns the `PostSidebar` for `post`. `related` is the `PostListItem[]` the route fetched once.

## Usage

```tsx
import { postSidebar } from "@indiecrafts/modules-web-blog/user-interface/post/layout/post-sidebar";

const sidebar = postSidebar(cards, post, locale, related);
// DefaultPostLayout takes `aside` and `mobileToc`; a composed layout passes it as `context.postSidebar`.
```

## Source

`code/modules/web/blog/src/user-interface/post/layout/post-sidebar.tsx`
