---
title: "UI messages schema"
description: "Sanity document schema for the per-locale UI dictionary, generated from the bundled message shape."
status: stable
---

# UI messages schema

> The `uiMessages.<locale>` singleton — the primary edit surface for the app's chrome strings, with fields generated from `messages/en.json`.

## Purpose

Defines the `uiMessages` Sanity document — a fixed-id singleton per locale (`uiMessages.en`, `uiMessages.fr`) holding the app's chrome strings (nav, cookies, validation, blog UI, system pages). It is the primary edit surface for that copy; `messages/<locale>.json` stays bundled as a fallback only. The schema's fields are generated from the message shape (`en.json`) so it cannot drift from the keys the app reads. The `typography` namespace is excluded (machine config, not editorial copy), and kebab-case keys stay bundled-only.

## Exports

- `default` — the `defineType` object for the `uiMessages` document, with fields built by `fieldsFrom(fallback, true)`.

## Source

`code/projects/web/surfaces/website/src/sanity/schema/ui-messages.ts`
