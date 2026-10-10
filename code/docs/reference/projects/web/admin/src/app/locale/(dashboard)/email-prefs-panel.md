---
title: "Email preferences panel"
description: "Show one person's email preferences and turn them off on request — never on."
status: stable
---

# Email preferences panel

> The categories, their state, and the off-only buttons — shared by the Users sheet and the Contacts page.

## Purpose

Shows the Resend contact's global state, then each category: the account's own choice (accounts only) and the Resend topic. A category that is on gets a "Turn off" button; "Stop all email" turns everything off. Each opens an inline confirm with a required reason (a fixed list), then calls `turnOffEmails`, toasts the result (a warning when Resend did not answer) and refreshes. There is no "turn on" control.

## Exports

- `EmailPrefsPanel({ state })` — client component.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/email-prefs-panel.tsx`
