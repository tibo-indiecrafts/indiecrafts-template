---
title: "Social share targets"
description: "Builds platform-agnostic share-intent URLs for X, LinkedIn, and Facebook from a page URL and title."
status: stable
---

# Social share targets

> Pure share-intent URLs, no DOM, so any surface can reuse them.

## Purpose

Builds platform-agnostic share-intent URLs for a page. The result is plain strings with no DOM, so any surface reuses them: the web renders a button row from them. Each target's `key` doubles as the icon's brand name.

## Exports

- `ShareNetwork` — the supported networks: `"x" | "linkedin" | "facebook"`.
- `ShareTarget` — a `{ key, href }` pair for one network.
- `shareTargets(url, title)` — builds the X, LinkedIn, and Facebook share-intent URLs for a page.

## Usage

```ts
import { shareTargets } from "@indiecrafts/packages-shared-utils/share";

const targets = shareTargets("https://site.dev/post", "My post");
// [{ key: "x", href: "https://twitter.com/intent/tweet?..." }, ...]
```

## Source

`code/packages/shared/utils/src/share.ts`
