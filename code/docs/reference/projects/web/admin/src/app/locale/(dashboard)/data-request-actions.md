---
title: "Data-request actions"
description: "Client component with the Start, Mark done and Reject moves for one data request."
status: stable
---

# Data-request actions

> The moves the request's status allows.

## Purpose

`new` shows Start, Mark done and Reject; `in-progress` shows Mark done and Reject; a closed request shows "This request is closed." Start moves it to in progress at once. Mark done / Reject open a reply box prefilled in the requester's language, plus "Email the requester" (on by default; then the reply is required). A prefilled reply marks what the operator must write in `[brackets]` (the reason of a refusal, GDPR Art. 12(4)); Confirm stays disabled, with a hint, until every bracket is replaced. Each move calls the `setDataRequestStatus` server action with the status the operator saw, then toasts the result — a warning when the email was not sent — and refreshes the page — also after a `changed` / `not_allowed` refusal, so the sheet shows the real status.

## Exports

- `DataRequestActions({ id, status, prefill })`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/data-request-actions.tsx`
