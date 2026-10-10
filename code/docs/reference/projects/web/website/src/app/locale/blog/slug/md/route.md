---
title: "Post Markdown export"
description: "Serves a clean Markdown version of a blog post at /`<locale>`/blog/`<slug>`/md for AI agents."
status: stable
---

# Post Markdown export

> The `/[locale]/blog/<slug>/md` endpoint: a post as plain Markdown.

## Purpose

A GET route handler that returns a text-only Markdown version of a post, so AI agents can read an article without parsing HTML. It serializes the post's PortableText body to Markdown with YAML frontmatter; an editor-authored `llmsFull` value wins over the serialized body. It honors `metadata.noIndex` (hidden posts 404) and the blog feature gate. The post page advertises this URL through a `text/markdown` alternate link.

## Exports

- `GET` — returns the Markdown response, or a 404 when the blog feature is off or the post is hidden or missing.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/blog/[slug]/md/route.ts`
