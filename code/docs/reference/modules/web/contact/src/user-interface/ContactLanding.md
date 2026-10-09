---
title: "Contact landing"
description: "Async server component that renders the contact page from the contactSettings singleton."
status: stable
---

# Contact landing

> The full-page contact view — locale copy from Sanity, rendered as the shared `ContactForm`.

## Purpose

`ContactLanding` is the contact module's full-page surface. It reads the `contactSettings` singleton, resolves each copy field for the active locale only (an empty field falls back to the form's `forms.*` text in that language, never to another language's Studio copy), and renders the shared `ContactForm` in its `card` variant inside a centered `<section>`, with the heading as the page's `<h1>`. The app route wraps it in the site chrome and owns the feature gate and SEO.

## Exports

- `ContactLanding` — async server component; prop `{ locale }` (`Locale`). Returns the contact section.

## Usage

```tsx
import { ContactLanding } from "@indiecrafts/modules-web-contact/user-interface/ContactLanding";

export default function Page({ locale }: { locale: Locale }) {
  return <ContactLanding locale={locale} />;
}
```

## Source

`code/modules/web/contact/src/user-interface/ContactLanding.tsx`
