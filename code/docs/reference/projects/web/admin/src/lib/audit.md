---
title: "Admin audit sink"
description: "Records privileged admin actions to the shared API, with a durable console fallback."
status: stable
---

# Admin audit sink

> Server-only log of privileged admin actions, never silently lost.

## Purpose

Posts each privileged admin action to the shared API's `/v1/events`, which writes the EU D1 `admin_audit` table. Bearer-gated with `APP_API_TOKEN`. It stores the admin's edge country but no IP (GDPR data minimization). If the API is unreachable it logs one structured line to Cloudflare Workers Logs, so the event is never lost and the admin action itself never fails on an audit hiccup.

## Exports

- `audit(event, fields)` — record one admin event (`admin.grant`, `admin.revoke_session`, `admin.revoke_user_sessions`, `admin.erasure_retry`, `admin.erasure_close`, `admin.cron_run`, `admin.data_request_status`, `admin.view_consent`, `admin.change_email` — the fallback when the api cannot write that one itself) with `actor` and `target` user ids, and an optional `reason` code (`OVERRIDE_REASONS`) — `admin.change_email` carries one.

## Usage

```ts
import { audit } from "@/lib/audit";

await audit("admin.grant", { actor: actorUserId, target: targetUserId });
```

## Source

`code/projects/web/surfaces/admin/src/lib/audit.ts`
