---
title: "Data-request side sheet"
description: "Side sheet that shows one GDPR data request, its deadline, its history and its actions."
status: stable
---

# Data-request side sheet

> One request, everything the operator needs to act on it.

## Purpose

The data-requests page renders it when the URL carries `?id=<n>` (the right in each row links there, and so does the owner alert email). It shows the status and an "Overdue" badge, then **the requester's message first** (a highlighted quote — the reason they wrote; "No message" when they only chose the right), the facts (email as a `mailto:` link, language, source page, submitted, due, policy version), the actions (`DataRequestActions`), and the history (status, time in UTC, admin, "email sent", note). Closing the sheet drops `?id`.

## Exports

- `DataRequestSheet({ request, prefill })` — `prefill` holds the two closing replies, already rendered by the page in the requester's language.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/data-request-sheet.tsx`
