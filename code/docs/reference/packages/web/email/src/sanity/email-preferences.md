---
title: "Email preferences singleton"
description: "The Sanity singleton defining the subscriber marketing preference centre — categories, notices, and the win-back topic."
status: stable
---

# Email preferences singleton

> The editor-defined marketing categories and notices for the subscriber preference centre.

## Purpose

Defines the `emailPreferences` Sanity singleton — the subscriber-facing preference centre. It holds the marketing categories a subscriber can toggle (seeded with the reserved keys `news`, `offers`, `partners`, `tips`), display-only transactional notices (seeded with "Sign-in and security" and "Your account and data", in English and French), and the win-back topic a departing contact is switched to in place of every other category. A category's `key` locks once saved so it can never drift under a live subscriber list. It is read by the preference-centre page, the unsubscribe flow, and the account-deletion path.

## Exports

- `emailPreferencesSchema` — the `emailPreferences` `SchemaTypeDefinition` (a Sanity document): categories, notices, and the win-back topic.
- `emailPreferencesStructureItem(S)` — the "Préférences e-mail" desk editor for the singleton.

## Usage

```ts
import {
  emailPreferencesSchema,
  emailPreferencesStructureItem,
} from "@indiecrafts/packages-web-email/sanity";

schemaTypes: [emailPreferencesSchema];
structure: (S) => [emailPreferencesStructureItem(S)];
```

## Source

`code/packages/web/email/src/sanity/email-preferences.ts`
