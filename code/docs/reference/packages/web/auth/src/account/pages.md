---
title: "Account widget pages"
description: "The contents of the account widget's custom pages: Privacy & consent, Emails, Language and Your data."
status: stable
---

# Account widget pages

> What each custom page of the account widget renders.

## Purpose

The four custom-page contents, shared by `AccountButton` (modal) and `AccountPage` (standalone `/account`). Each opens with a `PageTitle` at the size of Clerk's own titles. They render inside Clerk's `<UserProfile>`, so their Clerk hooks have a provider.

## Exports

- `ConsentContent(props)` — cookie choices (`AccountConsentTab`). Email choices live on the Emails page, one switch per category.
- `EmailsContent(props)` — the email preference centre, read in the page `locale`.
- `LanguageContent(props)` — title, intro and the `AccountLanguageTab`; passes `onLocaleChange`.
- `DataContent(props)` — export and deletion (`AccountDataTab`).

All take `AccountModalProps`.

## Source

`code/packages/web/auth/src/account/pages.tsx`
