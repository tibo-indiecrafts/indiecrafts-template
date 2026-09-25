---
title: "Locale suggestion strip"
description: "Non-intrusive banner suggesting a locale switch when the browser prefers another language."
status: stable
---

# Locale suggestion strip

> A top strip that suggests, but never forces, switching to the visitor's preferred language.

## Purpose

Renders the "this site is available in {your language}" strip. It stays non-intrusive — a top strip in `<main>` that keeps the visitor on the page and never auto-redirects. The layout renders it only when the browser's preferred locale differs from the active one and the dismiss cookie is unset. Switching or dismissing both write the cookie, so it does not nag again. Copy comes in as props, with `{language}` filled by the target's native name.

## Exports

- `LocaleSuggest` — the client component taking `suggested`, `suggestedLabel`, `message`, `switchLabel`, and `dismissLabel` props.

## Usage

```tsx
import { LocaleSuggest } from "@indiecrafts/packages-web-locale-suggest/LocaleSuggest";

<LocaleSuggest
  suggested="fr"
  suggestedLabel="Français"
  message="Ce site est aussi disponible en {language}."
  switchLabel="Passer en {language}"
  dismissLabel="Non merci"
/>;
```

## Source

`code/packages/web/locale-suggest/src/LocaleSuggest.tsx`
