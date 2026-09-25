---
title: "Email-preference categories"
description: "Fetches and locale-resolves the emailPreferences singleton's categories, notices, and Resend topic ids."
status: stable
---

# Email-preference categories

> The api's single runtime reader of the marketing-category definitions.

## Purpose

Reads the Studio `emailPreferences` singleton over raw GROQ-over-HTTP and resolves its categories and notices to a locale. This is the api's single runtime reader of the category definitions — web and mobile consume the api rather than reading Sanity. It never throws: an unset, unreachable, or empty Studio resolves to a seeded `news`-only default so the preference centre is never blank.

## Exports

- `PrefCategory` — one toggleable marketing category, locale-resolved: `key`, `name`, `description`, `includeAtSignup`, optional `resendTopicId`.
- `PrefNotice` — one display-only notice: `name`, `description`.
- `fetchEmailPreferences(env, locale, doFetch?)` — returns the categories, notices, `churnedTopicId`, and `optOutTopicIds`; never throws; `doFetch` is injectable for tests.

## Usage

```ts
import { fetchEmailPreferences } from "./consent/email-preferences-sanity";

const { categories, notices } = await fetchEmailPreferences(env, "fr");
```

## Source

`code/shared/api/src/consent/email-preferences-sanity.ts`
