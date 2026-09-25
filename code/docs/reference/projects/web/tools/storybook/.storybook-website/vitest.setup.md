---
title: "Website story test setup"
description: "Vitest setup that applies the website-surface preview annotations to every story run as a component test."
status: stable
---

# Website story test setup

> Wires the website-surface preview into the Vitest component-test run.

## Purpose

Vitest setup file for the website-surface story suite. It calls `setProjectAnnotations` with the surface `preview`, so every story inherits the same global decorators and parameters when it runs as a Vitest component test. Referenced by `vitest.website.config.ts`.

## Exports

No public exports (internal module).

## Source

`code/projects/web/tools/storybook/.storybook-website/vitest.setup.ts`
