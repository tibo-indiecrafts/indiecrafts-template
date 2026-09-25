---
title: "Listing pager"
description: "Presentational previous/next pager for a paginated blog listing."
status: stable
---

# Listing pager

> Previous / next links for a blog listing — renders nothing on a single page.

## Purpose

`Pager` is a pure presentational previous/next control. The route computes `page` and `pageCount` (via `lib/pagination`) and passes labels, so the component stays translation-agnostic. It returns `null` when `pageCount` is 1 or less. Page 1 links to the bare `basePath` (no `?page=1`) to keep one canonical URL per listing; deeper pages are crawlable through real links.

## Exports

- `Pager` — component taking `{ page, pageCount, basePath, labels }`, where `labels` is `{ label, previous, next, status }`. The `status` label supports `{page}` and `{total}` placeholders.

## Usage

```tsx
import { Pager } from "@indiecrafts/modules-web-blog/user-interface/shared/components/Pager";

<Pager
  page={page}
  pageCount={pageCount}
  basePath="/blog/tag/react"
  labels={{
    label: t("pager"),
    previous: t("prev"),
    next: t("next"),
    status: t("status"),
  }}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/shared/components/Pager.tsx`
