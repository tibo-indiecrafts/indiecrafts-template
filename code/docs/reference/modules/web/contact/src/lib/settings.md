---
title: "Contact settings reader"
description: "Server-only, React-cached reader for the editor-configurable contact form copy and enabled toggle."
status: stable
---

# Contact settings reader

> Reads the `contactSettings` singleton — form copy plus the Studio `enabled` toggle.

## Purpose

`getContactSettings` reads the editor-configurable `contactSettings` singleton from Sanity: the form copy fields (heading, description, email placeholder, field labels, button, consent text, success and error messages) and the Studio `enabled` toggle. It is server-only and wrapped in React `cache` so repeated reads within a request hit once.

## Exports

- `getContactSettings` — async, React-cached; returns the `contactSettings` document (or `null`).

## Usage

```ts
import { getContactSettings } from "@indiecrafts/modules-web-contact/lib/settings";

const settings = await getContactSettings();
```

## Source

`code/modules/web/contact/src/lib/settings.ts`
