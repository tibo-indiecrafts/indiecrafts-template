---
title: "Lead-magnet download endpoint"
description: "Verifies a signed token and streams a gated lead-magnet file."
status: stable
---

# Lead-magnet download endpoint

> A bad, tampered, or expired token is a 403. A valid one streams the file — the CDN URL never reaches the visitor.

## Purpose

Serves a gated lead-magnet download. The newsletter confirmation flow emails a signed, expiring `token`; this route verifies it through the newsletter module (`resolveMagnetDownload`) and **streams** the file from Sanity's CDN (`?dl=` → an attachment under its original name; `cache-control: private, no-store`). A redirect would give the visitor the permanent CDN URL, so the link's 7-day expiry would mean nothing. It fetches only from `cdn.sanity.io`. A bad, tampered, or expired token — or an unknown or disabled magnet — is a `403`; a CDN failure is a `502` (logged). The route rides the `newsletter` feature flag.

On Sanity's free plan the dataset is public, so the file stays listable by anyone: the gate trades a freebie for an e-mail, it is not access control.

## Exports

- `GET` — verifies the `token` query param and streams the file, or returns `403` / `404` / `502`.

## Source

`code/projects/web/surfaces/website/src/app/api/download/route.ts`
