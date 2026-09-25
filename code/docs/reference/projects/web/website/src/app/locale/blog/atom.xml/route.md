---
title: "Blog Atom feed"
description: "Serves the blog's Atom 1.0 feed, one per locale, behind the RSS feature gate."
status: stable
---

# Blog Atom feed

> The `/[locale]/blog/atom.xml` endpoint: the blog as an Atom 1.0 feed.

## Purpose

A GET route handler that renders an Atom 1.0 feed from `rssPostsQuery`. It is the sibling of `rss.xml` — the same data, locale pattern and gate, only the serialization differs. Atom uses ISO-8601 dates and a `<feed>`/`<entry>` shape with stable `<id>` values, which some readers and IndieWeb tooling prefer. It returns a 404 when the blog or RSS feature is off (`isRssEnabled`). All post values are XML-escaped before output.

## Exports

- `GET` — returns the Atom XML response, or a 404 when the feed is disabled.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/atom.xml/route.ts`
