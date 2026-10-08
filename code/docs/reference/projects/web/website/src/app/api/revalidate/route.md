---
title: "Revalidate webhook route"
description: "Signed Sanity publish webhook that purges the site's cached pages."
status: stable
---

# Revalidate webhook route

> `POST /api/revalidate` — Sanity calls it on each publish or delete; it clears every cached page.

## Purpose

`<SanityLive>` refreshes pages only while a visitor has the site open, and never clears a cached
"not found". Without this route, a newly published post stays 404 and a deleted one stays online.
The route checks the webhook's HMAC signature, then calls `revalidatePath("/", "layout")`, which
also drops the Sanity reads cached under those pages.

| Response                   | When                                            |
| -------------------------- | ----------------------------------------------- |
| `200 {"revalidated":true}` | Valid `sanity-webhook-signature`                |
| `401`                      | Signature missing, wrong secret or changed body |
| `503`                      | `SANITY_REVALIDATE_SECRET` is not set           |

## Setup (once per deployed site URL)

1. Set `SANITY_REVALIDATE_SECRET` for the environment (`.env.local` for a local deploy, or the
   GitHub Environment secret). The deploy syncs it to the Worker.
2. sanity.io/manage → project → **API** → **Webhooks** → **Create webhook**: URL
   `https://<site>/api/revalidate`, dataset `production`, trigger on **Create · Update · Delete**,
   HTTP method `POST`, **Secret** = the same value.

## Exports

- `POST` — the route handler.

## Source

`code/projects/web/surfaces/website/src/app/api/revalidate/route.ts`
