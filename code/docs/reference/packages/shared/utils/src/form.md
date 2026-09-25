---
title: "Form anti-spam primitives"
description: "Shared honeypot, too-fast, and email-shape checks for the public web forms."
status: stable
---

# Form anti-spam primitives

> One place for the honeypot, too-fast, and email heuristics the three form engines share.

## Purpose

Shared anti-spam and input primitives for the public web forms (newsletter, waitlist, contact). The heuristics and the email check live here once, so the form engines tune them in a single place instead of duplicating them.

## Exports

- `EMAIL_RE` — a lax email-shape regex (one `@`, a dot in the domain); not RFC-perfect on purpose.
- `tooFast(startedAt?)` — true when the form was submitted in under two seconds; clock-skew-safe, so a client clock running ahead never false-flags a real person.
- `isSpam(input)` — true when a submission looks like a bot: a filled honeypot or a too-fast submit.
- `isValidEmail(email?)` — true when the address is plausible and length-bounded (≤ 254 chars); trims and lowercases first.
- `cleanList(list?)` — trims and drops empty strings from a list (email `cc`/`bcc`/`to` config).

## Usage

```ts
import { isSpam, isValidEmail } from "@indiecrafts/packages-shared-utils/form";

if (isSpam({ honeypot: values.company, startedAt })) return;
if (!isValidEmail(values.email)) return;
```

## Source

`code/packages/shared/utils/src/form.ts`
