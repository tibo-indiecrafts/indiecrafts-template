---
title: "Guarded submit"
description: "The hook every public form uses to POST its fields with the anti-bot and consent data."
status: stable
---

# Guarded submit

> One hook for every public form's submit: status, consent, honeypot, timing, Turnstile.

## Purpose

`useGuardedSubmit(endpoint)` holds the state every public form shares and posts it.
`submit(fields)` sends the form's own fields plus what the server's `withGuard` and anti-spam
checks read: `source` (the page path, which a form may override), `consent`, the page `language`
(so emails and the stored record follow the visitor), the `honeypot`, `startedAt` (a near-instant
submit is a bot) and the Turnstile token. A `201` sets `status` to `success`; anything else sets
`error` and resets the Turnstile widget for a retry. `canSubmit` is true once consent is ticked
and Turnstile (when active) has answered.

## Exports

- `useGuardedSubmit(endpoint)` — returns `{ uid, status, consent, setConsent, honeypot,
setHoneypot, setToken, tokenKey, submit, canSubmit }`.
- `GuardedSubmit` — that return type.

## Source

`code/packages/web/ui-components/src/web/form/useGuardedSubmit.ts`
