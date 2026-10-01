---
title: "Data-request actions"
description: "Client component with the Start, Mark done and Reject moves for one data request."
status: stable
---

# Data-request actions

> The moves the request's status allows.

## Purpose

`new` shows Start, Mark done and Reject; `in-progress` shows Mark done and Reject; a closed request shows "This request is closed." Start moves it to in progress at once. Mark done / Reject open a reply box prefilled in the requester's language, plus "Email the requester" (on by default; then the reply is required). Each move calls the `setDataRequestStatus` server action with the status the operator saw, then toasts the result — a warning when the email was not sent — and refreshes the page.

## Exports

- `DataRequestActions({ id, status, prefill })`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/data-request-actions.tsx`
