---
title: "Clerk email copy"
description: "Fetches the Studio clerkEmails copy, resolves it to a locale, and maps Clerk slugs to canonical kinds."
status: stable
---

# Clerk email copy

> The Sanity overlay and slug matcher behind the localized Clerk auth emails.

## Purpose

Reads the `clerkEmails` singleton and the global support address over raw GROQ-over-HTTP, resolves each field to the recipient's locale, and maps Clerk's varying email slugs to canonical kinds. It never throws: an unset or unreachable Studio resolves to `null`, so templates fall back to their hardcoded copy. The read is cached in-worker for 5 minutes.

## Exports

- `AuthKind` — the canonical id behind Clerk's slugs (verification, resetPassword, magicLink, and so on).
- `AuthEmailStrings` — the editable groups plus `supportEmail`, `bccAll`, and the `welcome` group.
- `authKind(slug)` — maps a Clerk slug to an `AuthKind`, forgivingly; `null` for a slug not localized.
- `canonicalAuthSlug(slug)` — the canonical template slug for a Clerk slug, or `undefined`.
- `resolveAuthCopy(strings, slug, locale)` — the Studio override for one email in the recipient's locale, or `undefined`.
- `resolveWelcomeCopy(strings, locale)` — the Studio override for the welcome email, or `undefined`.
- `authSupportCopy(strings, slug)` — the support address to blind-copy, when the email's group opts in (`copySupport`). Only the notice kinds (password, passkey, two-step, primary email, account locked) qualify: a code, a magic link, an invitation or a device sign-out link is never copied, whatever the stored value.
- `fetchAuthEmailStrings(env, doFetch?)` — fetches and locale-agnostically returns the copy; never throws; `doFetch` is injectable and bypasses the cache.

## Usage

```ts
import { fetchAuthEmailStrings, resolveAuthCopy } from "./clerk-email/sanity";

const strings = await fetchAuthEmailStrings(env);
const copy = resolveAuthCopy(strings, slug, "fr");
```

## Source

`code/shared/api/src/clerk-email/sanity.ts`
