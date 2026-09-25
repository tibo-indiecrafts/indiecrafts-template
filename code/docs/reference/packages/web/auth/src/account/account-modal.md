---
title: "Account modal"
description: "The Clerk account trigger and profile that add custom Privacy & consent and Your data tabs to the built-in account UI."
status: stable
---

# Account modal

> Clerk's account UI plus two custom pages — consent and data — mounted identically on the header and the standalone page.

## Purpose

The account trigger and profile. It renders Clerk's `<UserButton>` (avatar to "Manage account") and `<UserProfile>` with Clerk's built-in tabs plus two custom pages: "Privacy & consent" and "Your data". The custom pages render inside Clerk's profile, so their hooks have a provider. All copy is resolved per surface from `messages/` and passed in.

## Exports

- `AccountCopy` — the localized copy the account tabs need (tab labels, consent title and save label, marketing label, and delete/export copy).
- `AccountModalProps` — the props both entry points share (API URL, export flag, consent categories, policy version, storage key, surface, and copy).
- `AccountButton(props)` — the avatar trigger with the two custom profile pages, for the header and sidebar.
- `AccountPage(props)` — the standalone `/account` full-page fallback with the same custom pages (hash routing, no catch-all route).

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
