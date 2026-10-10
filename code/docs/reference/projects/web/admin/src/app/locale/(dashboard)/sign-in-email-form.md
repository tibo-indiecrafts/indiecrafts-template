---
title: "Sign-in email form"
description: "Change an account's sign-in email for a person who lost access — typed twice, with a reason."
status: stable
---

# Sign-in email form

> The form behind `changeSignInEmail`.

## Purpose

Asks for the new address twice and a reason code, then calls `changeSignInEmail`. The result is a toast: done, a warning when the Resend contact could not be moved, or the reason it was refused (mismatch, same address, an admin's account, an address another account uses).

## Exports

- `SignInEmailForm({ userId, current })` — client component.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/sign-in-email-form.tsx`
