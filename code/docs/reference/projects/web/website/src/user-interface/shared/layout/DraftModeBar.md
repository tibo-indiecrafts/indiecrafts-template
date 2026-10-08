---
title: "Draft mode bar"
description: "Bottom bar that tells an editor the site shows unpublished changes, with a link to exit the preview."
status: stable
---

# Draft mode bar

> Says "you see unpublished changes" and links to `/api/draft-mode/disable`.

## Purpose

The draft-mode cookie outlives the Studio's **Aperçu** tab. An editor who then browses the site
in the same browser would read drafts as if they were live. The layout renders this bar only in
draft mode; it hides itself inside the Studio's preview iframe (`useIsPresentationTool`), where
the Studio has its own control. It is fixed at the bottom and marked `data-bottom-bar`: a
`globals.css` rule then lifts the bottom-slot overlays (cookie and legal banners, prompts)
above it and pads the page, so nothing overlaps.

## Exports

- `DraftModeBar` — client component; takes `label` and `exit` (from `messages.common.preview` / `exitPreview`).

## Usage

```tsx
import { DraftModeBar } from "@/user-interface/shared/layout/DraftModeBar";

<DraftModeBar label={t("preview")} exit={t("exitPreview")} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/shared/layout/DraftModeBar.tsx`
