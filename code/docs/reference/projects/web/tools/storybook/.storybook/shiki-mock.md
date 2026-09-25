---
title: "Shiki Storybook stub"
description: "Stub for shiki that returns unhighlighted code in the story canvas, where the real WASM highlighter hangs."
status: stable
---

# Shiki Storybook stub

> A no-WASM `codeToHtml` so CodeBlock stories render.

## Purpose

The real Shiki highlighter loads a WASM engine that hangs in the browser-only story canvas (it runs fine server-side in the app). This module is aliased in `main.ts` to replace `shiki`. Its `codeToHtml` returns the escaped code inside a plain `<pre class="shiki">`, so the CodeBlock stories show the block chrome and code without waiting on WASM.

## Exports

- `codeToHtml(code)` — async; returns the HTML-escaped code wrapped in an unhighlighted `<pre class="shiki">`.
- `default` — object exposing `codeToHtml`.

## Source

`code/projects/web/tools/storybook/.storybook/shiki-mock.ts`
