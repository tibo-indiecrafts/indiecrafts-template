---
title: "Contact page route"
description: "Thin contact landing shell gated by the contact feature and the editor enabled toggle."
status: stable
---

# Contact page route

> The `/[locale]/contact` route: a thin shell around the contact module.

## Purpose

A thin contact landing route. The gate, chrome and SEO live here; the view (`ContactLanding`, its copy resolved from the Sanity `contactSettings` singleton) lives in the contact module. The route `notFound()`s when `features.contact` is off or the editor `enabled` toggle is false. SEO copy is Sanity-only, on the `contactSettings` singleton's `.seo`.

## Exports

- `generateMetadata` — builds SEO metadata for the contact page from `pages.contact`.
- `ContactPage` (default) — the gated shell that renders `ContactLanding`.

## Source

`code/projects/web/surfaces/website/src/app/[locale]/contact/page.tsx`
