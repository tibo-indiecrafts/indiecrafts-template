---
title: "Consent sheet"
description: "Admin side sheet showing one user's consent decisions: current state, then the dated timeline."
status: stable
---

# Consent sheet

> Opened from Users → a row's "Consent" link (`?consent=<userId>`).

## Purpose

A side sheet on the users page. "Current state" lists the latest decision per consent type with its date and a Granted / Refused badge; "History" is the timeline (date, type, decision, surface, source, country, policy version), newest first. Types and sources show as labels in the admin's locale (`admin.consent.types` / `sources`; an email category reads "Emails: `<key>`"; an unknown code shows as is). A `null` history is a load error, distinct from a user with no decision. Closing the sheet returns to the list, keeping the search.

## Exports

- `ConsentSheet({ email, history, closeHref })` — the client sheet.

## Source

`code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/consent-sheet.tsx`
