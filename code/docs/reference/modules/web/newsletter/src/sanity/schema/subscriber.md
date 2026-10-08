---
title: "Subscriber schema"
description: "Sanity document for a newsletter subscriber captured by the API."
status: stable
---

# Subscriber schema

> The API-written subscriber record — read-only fields plus an editable status.

## Purpose

Defines the `subscriber` Sanity document, captured by the `module.newsletter` block via `/api/newsletter` with the server-only write client. Editors do not create these by hand; the "Abonnés" desk lists and manages them. API-written fields are read-only; `status` is editable so an editor can mark confirmed or unsubscribed. Double opt-in: a `pending` subscriber holds a one-time `confirmToken` (issued at `confirmTokenAt`, valid 7 days) that the confirm link clears. `newsletter` records the purpose — `false` for a lead-magnet-only sign-up, shown as "· document seulement" in the desk. `status` turns `unsubscribed` by itself when the person unsubscribes from a Resend email (the api webhook). The `consentPolicyVersion` field stores the accepted privacy-policy version as GDPR proof of consent.

## Exports

- default — the `subscriber` Sanity document type (`defineType`).

## Source

`code/modules/web/newsletter/src/sanity/schema/subscriber.ts`
