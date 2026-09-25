---
title: "Blog search form"
description: "Presentational blog search box rendered as a JS-free GET form that navigates to a shareable results URL."
status: stable
---

# Blog search form

> A plain GET form — no client JS — so search results render server-side and the URL is shareable.

## Purpose

`BlogSearchForm` renders the blog search box. Submitting navigates to `action?q=…`, so results render server-side and the URL is shareable. It is used on the frontpage and the `/blog/search` results page. `action` is a locale-prefixed path (the caller passes `localizedPathname("/blog/search")`).

## Exports

- `BlogSearchForm` — component taking `{ action, defaultValue?, labels }`, where `labels` is `{ label, placeholder, submit }`.

## Usage

```tsx
import { BlogSearchForm } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogSearchForm";

<BlogSearchForm
  action={localizedPathname("/blog/search")}
  defaultValue={query}
  labels={{
    label: t("search.label"),
    placeholder: t("search.placeholder"),
    submit: t("search.submit"),
  }}
/>;
```

## Source

`code/modules/web/blog/src/user-interface/shared/components/BlogSearchForm.tsx`
