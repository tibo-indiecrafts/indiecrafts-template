---
title: "Account modal"
description: "The Clerk account trigger and profile that add custom Privacy & consent, Emails and Your data tabs to the built-in account UI."
status: stable
---

# Account modal

> Clerk's account UI plus three custom pages — consent, emails and data — mounted identically on the header and the standalone page.

## Purpose

The account trigger and profile. It renders Clerk's `<UserButton>` (avatar to "Manage account") and `<UserProfile>` with Clerk's built-in tabs plus three custom pages, each opened by a `PageTitle` heading at the same size as Clerk's own titles (`text-lg` semibold; `headerTitle` in `authAppearance`): "Privacy & consent", "Emails" (the email preference centre, `#/emails`, read in the page `locale` with Clerk's stable `getToken`) and "Your data". The custom pages render inside Clerk's profile, so their hooks have a provider. All copy is resolved per surface from `messages/` and passed in.

## Exports

- `AccountCopy` — the localized copy the account tabs need (tab labels, consent title and save label, marketing label, the Emails page title/intro/chrome, and delete/export copy).
- `AccountModalProps` — the props both entry points share (API URL, export flag, consent categories, policy version, storage key, surface, locale, and copy).
- `AccountButton(props)` — the avatar trigger with the three custom profile pages, for the header and sidebar.
- `AccountPage(props)` — the standalone `/account` full-page fallback with the same custom pages (hash routing, no catch-all route). Its card is capped at its container (Clerk caps it at the viewport, which overflows next to a sidebar); the surface page centres it.

## Usage

```tsx
import { AccountButton } from "@indiecrafts/packages-web-auth/account/account-modal";

<AccountButton
  apiUrl={apiUrl}
  showExport
  categories={categories}
  policyVersion={policyVersion}
  consentStorageKey={storageKey}
  surface="website"
  copy={copy}
/>;
```

## Source

`code/packages/web/auth/src/account/account-modal.tsx`
