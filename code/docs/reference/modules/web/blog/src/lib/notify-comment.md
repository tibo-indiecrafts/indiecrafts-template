---
title: "New-comment owner alert"
description: "Sends the site owner a best-effort email when a comment is submitted."
status: stable
---

# New-comment owner alert

> Best-effort owner email — never throws.

## Purpose

Sends the site team an alert email when a comment is submitted. It never throws, so a mail failure cannot fail an already-saved comment. Config and copy live on the shared `emailStrings` entity (Studio → E-mails → commentNotification); `renderCommentNotificationEmail` builds the body and `sendEmail` delivers it. It no-ops when the alert is disabled, has no recipients, or `RESEND_API_KEY` is unset.

## Exports

- `notifyNewComment(input, moderationToken?)` — resolves to `void`; sends the alert as a side effect.

## Usage

```ts
import { notifyNewComment } from "@indiecrafts/modules-web-blog/lib/notify-comment";

await notifyNewComment(input, moderationToken);
```

## Source

`code/modules/web/blog/src/lib/notify-comment.ts`
