---
title: "Lead-magnet download endpoint"
description: "Verifies a signed token and redirects to a gated lead-magnet file."
status: stable
---

# Lead-magnet download endpoint

> A bad, tampered, or expired token is a 403 — the CDN URL never leaks.

## Purpose

Serves a gated lead-magnet download. The newsletter confirmation flow emails a signed, expiring `token`; this route verifies it through the newsletter module (`resolveMagnetDownload`) and redirects to the file URL. A bad, tampered, or expired token — or an unknown or disabled magnet — is a `403`, so the CDN URL is never revealed to an unconfirmed request. The route rides the `newsletter` feature flag.

## Exports

- `GET` — verifies the `token` query param, redirects to the file URL, or returns `403` / `404`.

## Source

`code/projects/web/surfaces/website/src/app/api/download/route.ts`
