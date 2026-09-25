---
title: "Email preference centre"
description: "Transport-agnostic email preference UI with optimistic category toggles and a read-only notices list."
status: stable
---

# Email preference centre

> A switch per email category (optimistic, rolls back on a failed write) plus a read-only "Account & security" notices list.

## Purpose

Client component in `src/user-interface/account`. It renders one `Switch` per email category and a read-only notices list. Toggling is optimistic and rolls back on a failed write. It is transport-agnostic: the `read`/`write` functions are injected, so the same UI serves the JWT account mount and the public token page. Category and notice copy arrive from the api already locale-resolved; only the chrome strings come from `messages/`.

## Exports

- `EmailPreferences` — React component; props `read`, `write`, `chrome`.
- `EmailPreferenceCategory` — a toggleable category (key, name, description, flags).
- `EmailPreferenceNotice` — a display-only notice (name, description).
- `EmailPreferencesData` — the read payload (`categories`, `notices`, `marketing_email`).
- `EmailPreferencesUpdate` — one write item (`key`, `granted`).
- `EmailPreferencesCopy` — chrome strings (`noticesHeading`, `loading`, `error`, `retry`).
- `EmailPreferencesProps` — the component prop shape.

## Usage

```tsx
import { EmailPreferences } from "@/user-interface/account/EmailPreferences";

<EmailPreferences read={read} write={write} chrome={chrome} />;
```

## Source

`code/projects/web/surfaces/website/src/user-interface/account/EmailPreferences.tsx`
