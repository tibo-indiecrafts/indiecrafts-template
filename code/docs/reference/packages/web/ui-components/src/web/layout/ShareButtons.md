---
title: "Share buttons"
description: "Social share row plus a copy-link button, generic over a resolved URL and title."
status: stable
---

# Share buttons

> X, LinkedIn, and Facebook share intents plus a copy-link button, over a resolved URL and title.

## Purpose

`ShareButtons` renders a share row: X, LinkedIn, and Facebook open a share intent in a new tab (plain links, no JS needed), and "copy link" uses the clipboard API, so this is a client component. It is generic over `url` and `title`, resolved by the host — the blog post mounts it inline, while `DefaultLayout` mounts it in the footer for a site-wide share. When `url` is omitted (client-only surfaces such as the app), it resolves the current page URL in an effect so SSR and the first client render match. Intent URLs come from the shared `shareTargets` helper; `networks` filters which controls show.

## Exports

- `ShareButtons({ url, title, labels, networks })` — the share-row component.

## Usage

```tsx
import { ShareButtons } from "@indiecrafts/packages-web-ui-components/web/layout/ShareButtons";

<ShareButtons
  url="https://example.com/blog/launch"
  title="We launched"
  labels={{
    label: "Share",
    x: "Share on X",
    linkedin: "Share on LinkedIn",
    facebook: "Share on Facebook",
    copy: "Copy link",
    copied: "Copied",
  }}
/>;
```

## Source

`code/packages/web/ui-components/src/web/layout/ShareButtons.tsx`
