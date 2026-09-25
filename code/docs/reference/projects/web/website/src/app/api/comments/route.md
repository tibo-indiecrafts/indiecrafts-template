---
title: "Comment submission endpoint"
description: "Public POST endpoint that accepts and stores a blog comment."
status: stable
---

# Comment submission endpoint

> Guarded boundary in the route; validation and write in the blog module.

## Purpose

Accepts a public comment submission for a blog post. `withGuard` hardens the boundary (same-site origin, body cap, rate limit, optional Turnstile) and parses the body once; the module's `createComment` validates, whitelists, and writes. A honeypot-flagged submission returns `201` too, so a bot cannot tell it was dropped. The route `404`s when comments are disabled.

## Exports

- `POST` — accepts a comment payload, returns `201` on success or silent spam, `400` on invalid, `404` when disabled, `500` on error.

## Source

`code/projects/web/surfaces/website/src/app/api/comments/route.ts`
