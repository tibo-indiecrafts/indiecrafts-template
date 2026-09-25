---
title: "Data request form"
description: "Client GDPR data-subject request form that posts a chosen right and email to /api/data-request."
status: stable
---

# Data request form

> A visitor picks a GDPR right, gives an email, and submits a `dataRequest` record.

## Purpose

`DataRequestForm` lets a visitor pick a data-subject right, give their email and an optional message, and submit. It posts to `/api/data-request`, which stores a `dataRequest` record and alerts the controller. A hidden honeypot plus a render timestamp block bots; Turnstile gates submit when a site key is set. All copy is passed in — the component imports no app messages.

## Exports

- `DataRequestOption` — type: one selectable right (`value` is a request-type key, `label` is localized).
- `DataRequestCopy` — type: all copy resolved server-side and handed to the form, plus the active `locale`.
- `DataRequestForm(props)` — the client request form component.

## Usage

```tsx
import { DataRequestForm } from "@indiecrafts/packages-web-ui-components/web/form/DataRequestForm";

<DataRequestForm
  legend="Which right do you want to exercise?"
  options={[{ value: "access", label: "Access my data" }]}
  emailLabel="Email"
  messageLabel="Details"
  consentText="I confirm this request."
  submitLabel="Submit"
  successMessage="Request received."
  errorMessage="Something went wrong."
/>;
```

## Source

`code/packages/web/ui-components/src/web/form/DataRequestForm.tsx`
