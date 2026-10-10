---
title: "Admin id patterns"
description: "The id and address patterns the admin validates before calling Clerk or the api."
status: stable
---

# Admin id patterns

> One copy of each pattern, for every admin action and reader.

## Purpose

`USER_ID` — a Clerk user id, bounded in length so a forged value cannot be huge (the api checks its own strict form too). `EMAIL` — an address the api accepts: no URL-path characters, because it goes into Resend's path.

## Exports

- `USER_ID` · `EMAIL` — regular expressions.

## Source

`code/projects/web/surfaces/admin/src/lib/ids.ts`
