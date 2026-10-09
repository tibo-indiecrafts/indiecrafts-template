---
title: "Guarded fields"
description: "The form element with the honeypot, consent box, Turnstile and error line around a form's own fields."
status: stable
---

# Guarded fields

> The guard around a form's own fields, plus the shared input and submit button.

## Purpose

`GuardedFields` renders the `<form>`: an off-screen honeypot (hidden from assistive tech; only
bots fill it), the form's own fields (`children`), the consent checkbox (always shown), the
Turnstile widget, an optional `footer` (a full-width submit) and the error line (an assertive
live region). `onSubmit` runs after the browser's own field validation. `FormInput` is a text
input whose screen-reader label is its placeholder; `SubmitButton` stays disabled until the guard
allows it (consent ticked, Turnstile answered when active). On a `banner` card the inputs and
labels switch to the banner's colours. Client-side parts with no `"use client"` entry: only the
client forms render them, so the `onSubmit` function never crosses a server boundary.

## Exports

- `GuardedFields({ guard, onSubmit, consentText, errorText, banner, footer?, className?, children })`.
- `FormInput({ id, label, banner, ...inputProps })`.
- `SubmitButton({ guard, banner, className?, children })`.

## Source

`code/packages/web/ui-components/src/web/form/GuardedFields.tsx`
