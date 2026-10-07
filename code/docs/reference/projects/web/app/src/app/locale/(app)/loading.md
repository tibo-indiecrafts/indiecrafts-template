---
title: "App group loading state"
description: "The loading state shown inside the shell while a (app) page streams in."
status: stable
---

# App group loading state

> A spinner and a status message while a `(app)` page loads. The shell stays on screen.

## Purpose

Next wraps each `(app)` page in a Suspense boundary with this fallback. It sits under the group layout, so the sidebar and header stay while the page streams in. A `role="status"` region holds a visually hidden label (`app.loading` in `messages/<locale>.json`); the `Spinner` is `aria-hidden`.

## Exports

- default export `AppLoading()`.

## Source

`code/projects/web/surfaces/app/src/app/[locale]/(app)/loading.tsx`
