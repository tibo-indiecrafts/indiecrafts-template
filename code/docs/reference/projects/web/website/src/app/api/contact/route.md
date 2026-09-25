---
title: "Contact submission endpoint"
description: "Public POST endpoint that accepts and stores a contact message."
status: stable
---

# Contact submission endpoint

> Guarded boundary in the route; validation, write, and email in the contact module.

## Purpose

Accepts a public contact form submission. `withGuard` hardens the boundary (same-site origin, body cap, rate limit, optional Turnstile) and parses the body once; the module's `submit` validates, whitelists, writes the `contactMessage`, and fires the best-effort emails. A honeypot-flagged submission returns `201` too. The route `404`s when `features.contact` is off, and again when the Studio `enabled` toggle is `false` — a live kill switch that matches the `/contact` page.

## Exports

- `POST` — accepts a contact payload, returns `201` on success or silent spam, `400` on invalid, `404` when disabled, `500` on error.

## Source

`code/projects/web/surfaces/website/src/app/api/contact/route.ts`
