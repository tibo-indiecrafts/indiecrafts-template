---
title: "Core Sanity module"
description: "The app's feature-independent Sanity contribution — the shared SEO, navigation, and UI-message desk surfaces."
status: stable
---

# Core Sanity module

> The `core` SanityModule barrel — schemas plus the shared-content desk.

## Purpose

Exposes the app's feature-independent Sanity contribution: the site-wide shared surfaces (SEO, navigation, UI messages) that survive with every module removed and are read by every app and lens. It goes in the "Contenu partagé" Studio group and is composed into the Studio via `composeStudio`.

## Exports

- `coreSanity` — the `core` `SanityModule` (schema types plus the shared-content structure).

## Usage

```ts
import { coreSanity } from "@/sanity";

const studio = composeStudio([coreSanity]);
```

## Source

`code/projects/web/surfaces/website/src/sanity/index.ts`
