---
title: "Waitlist entry schema"
description: "Sanity document for a single early-access signup, captured by the API or added by hand."
status: stable
---

# Waitlist entry schema

> One waitlist signup — editor-creatable, with API-filled fields read-only.

## Purpose

Defines the `waitlistEntry` document. Entries are captured by the `module.waitlist` block through `/api/waitlist` or added by hand in the desk. The editable fields are `email`, `name`, and `status`; the API-filled fields (`source`, `language`, `consent`, `consentPolicyVersion`, `createdAt`) are read-only. It previews by name or email and orders newest-first.

## Exports

- `default` — the `defineType` document definition for `waitlistEntry`.

## Usage

```ts
import waitlistEntry from "@indiecrafts/modules-web-waitlist/sanity/schema/waitlist-entry";
```

## Source

`code/modules/web/waitlist/src/sanity/schema/waitlist-entry.ts`
