---
title: "Email preference centre"
description: "Transport-agnostic email preference UI with optimistic category toggles, a read-only notices list, and the signed-in JWT transport."
status: stable
---

# Email preference centre

> A switch per email category (optimistic, rolls back on a failed write) plus a read-only "Account & security" notices list.

## Purpose

Client component shared by the website and the app. It renders one `Switch` per email category and a read-only notices list. Toggling is optimistic and rolls back on a failed write. It is transport-agnostic: `read`/`write` are injected, so the same UI serves the signed-in **Emails** page of the account widget (`@indiecrafts/packages-web-auth`) and the website's public token page. Category and notice copy arrive from the api already locale-resolved; only the chrome strings come from each surface's `messages/`.

`emailPreferencesIo` is the signed-in transport: `GET/POST /v1/consent/email-preferences` with the user's Clerk JWT. The read sends the page's `locale`, so the category copy matches the UI language. It throws on a missing token or a non-2xx, so the UI shows its error state instead of a falsely empty list.

## Exports

- `EmailPreferences` — React component; props `read`, `write`, `chrome`.
- `emailPreferencesIo(apiUrl, getToken, surface, locale, f?)` — the signed-in `read`/`write` pair; `f` is injectable for tests.
- `EmailPreferenceCategory` — a toggleable category (key, name, description, flags).
- `EmailPreferenceNotice` — a display-only notice (name, description).
- `EmailPreferencesData` — the read payload (`categories`, `notices`, `marketing_email`).
- `EmailPreferencesUpdate` — one write item (`key`, `granted`).
- `EmailPreferencesCopy` — chrome strings (`noticesHeading`, `loading`, `error`, `retry`).
- `EmailPreferencesProps` — the component prop shape.

## Usage

```tsx
import {
  EmailPreferences,
  emailPreferencesIo,
} from "@indiecrafts/packages-shared-compliance/web";

const io = emailPreferencesIo(apiUrl, () => getToken(), "website", locale);
<EmailPreferences read={io.read} write={io.write} chrome={chrome} />;
```

## Source

`code/packages/shared/compliance/src/web/EmailPreferences.tsx`
