---
title: "Blog RSS feed"
description: "Serves the blog's RSS 2.0 feed, one per locale, behind the RSS feature gate."
status: stable
---

# Blog RSS feed

> The `/[locale]/blog/rss.xml` endpoint: the blog as an RSS 2.0 feed.

## Purpose

A GET route handler that renders an RSS 2.0 feed from `rssPostsQuery`, one per locale, matching the sitemap and llms.txt locale pattern. It honors `metadata.noIndex` (hidden posts are filtered by the query) and returns a 404 when the blog or RSS feature is off (`isRssEnabled`). The body export (`content:encoded`) is intentionally omitted to avoid an extra HTML-serialization dependency. All post values are XML-escaped before output.

## Exports

- `GET` — returns the RSS XML response, or a 404 when the feed is disabled.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/rss.xml/route.ts`
