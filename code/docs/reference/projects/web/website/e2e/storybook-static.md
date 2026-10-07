---
title: "Storybook build path"
description: "The location of the built Storybook that the visual e2e suite serves and screenshots."
status: stable
---

# Storybook build path

> One constant: where `storybook:build` writes the gallery the visual suite screenshots.

## Purpose

The visual suite needs the built Storybook twice: `playwright.config.ts` serves it on port 6007, and `e2e/visual.spec.ts` reads its `index.json` to create one test per story. Both import this path, so they cannot drift. They did once: the config still pointed at the old `code/projects/web/packages/storybook` folder after Storybook moved to `web/tools/storybook`, so the CI visual job could never start.

## Exports

- `STORYBOOK_STATIC` — the absolute path to `code/projects/web/tools/storybook/storybook-static`.

## Source

`code/projects/web/surfaces/website/e2e/storybook-static.ts`
