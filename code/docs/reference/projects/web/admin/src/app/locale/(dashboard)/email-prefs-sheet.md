---
title: "Email preferences sheet"
description: "One account's email side sheet: preferences (off only) and its sign-in email."
status: stable
---

# Email preferences sheet

> Opened by `?emails=<userId>` on the Users page.

## Purpose

A side sheet with the `EmailPrefsPanel` and, below it, the `SignInEmailForm`. `state` is `null` when the api could not be read — shown as an error, never as "no preferences". Closing it drops the query.

## Exports

- `EmailPrefsSheet({ userId, email, state, closeHref })` — client component.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/email-prefs-sheet.tsx`
