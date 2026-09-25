---
title: "Mobile table of contents"
description: "A collapsed 'On this page' jump list rendered below the lg breakpoint on a post."
status: stable
---

# Mobile table of contents

> Native `<details>` jump list of a post's headings, shown only on small screens.

## Purpose

`MobileToc` renders the article's headings as a tap-to-jump index on small screens, where the sticky sidebar `Toc` is hidden (`lg:hidden`). It uses a native `<details>` element, so it needs no JavaScript and does no scroll-spy. Anchors are `slugify`-derived heading ids that match the post body's rendered headings.

## Exports

- `MobileToc` — server component; takes `headings` (`Heading[]`) and `title` (string). Returns `null` when `headings` is empty.

## Usage

```tsx
import { MobileToc } from "@indiecrafts/modules-web-blog/user-interface/post/components/MobileToc";

<MobileToc headings={post.headings!} title={t("onThisPage")} />;
```

## Source

`code/modules/web/blog/src/user-interface/post/components/MobileToc.tsx`
