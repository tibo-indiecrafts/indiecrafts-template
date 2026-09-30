---
title: "Erasure row actions"
description: "Client component with the Retry and Close-manually actions for one open erasure request."
status: stable
---

# Erasure row actions

> The buttons on each open row of the Erasure requests page.

## Purpose

Retry shows only on a `confirmed` (stuck) request. When the api answers `email_required`, an email field appears; the typed email goes to the server action once and is never kept. Close manually opens a dialog with a required note (5–500 characters) and a destructive confirm button. Both show a toast with the outcome and refresh the page. Keyboard and screen reader: each button carries a visually hidden `— request #<id>`, so a list of identical buttons stays distinguishable; the email field takes focus when it appears; the row is a form, so Enter in the field retries.

## Exports

- `ErasureRowActions({ id, status })`.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/erasure-row-actions.tsx`
