---
title: "Lead-magnet delivery"
description: "Signs gated download links and delivers lead-magnet files to confirmed subscribers."
status: stable
---

# Lead-magnet delivery

> The gated-delivery path — sign a short-lived token, email the download, verify on request.

## Purpose

Handles lead-magnet delivery after a subscriber confirms their email. A `module.lead-magnet` capture block tags the subscriber with a `leadMagnet` doc id; on confirm, this module signs a short-lived gated-delivery token and emails the download link. The `/api/download` route later verifies the token and resolves the file URL. Delivery is gated on the server-only `LEAD_MAGNET_SECRET` — without it, no token can be signed or verified. Server-only.

## Exports

- `getLeadMagnetAssetUrl(id)` — resolves an enabled magnet's file URL by id; `null` when missing or disabled.
- `resolveMagnetDownload(token)` — verifies a download token and resolves the URL; returns `{ ok: true, url }` or `{ ok: false, status: 403 }`.
- `deliverMagnetsForTags(email, tags, language)` — emails every lead magnet a confirmed subscriber signed up for; best-effort, a non-magnet tag is a no-op.

## Usage

```ts
import { resolveMagnetDownload } from "@indiecrafts/modules-web-newsletter/lib/deliver-magnet";

const result = await resolveMagnetDownload(token);
if (result.ok) redirect(result.url);
```

## Source

`code/modules/web/newsletter/src/lib/deliver-magnet.ts`
