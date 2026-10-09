---
title: "Email test samples"
description: "The website's email samples for the Studio test: team alerts once, visitor emails per language."
status: stable
---

# Email test samples

> The website emails the Studio "Send test" renders, as the real emails go out.

## Purpose

`buildSamples(to, locales)` renders one sample per **enabled** website email, from the Studio copy
(`getEmailStrings()`), with a sensible default where a field is empty: each team alert once, in the
default locale; each visitor email once per chosen locale, labelled `<group> · <locale>`. Every sample
carries the support line, as every real email does. The app is the one place allowed to import every
module's template, like `sanity.config.ts`. The route sends them; the api worker covers the service
and account emails.

## Exports

- `buildSamples(to, locales)` — the samples, ready for `sendEmail`.
- `Sample` — `{ label, from, message }`.

## Source

`code/projects/web/surfaces/website/src/app/api/emails/test/samples.ts`
