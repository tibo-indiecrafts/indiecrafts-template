---
title: "Gallery story test setup"
description: "Vitest setup that applies the gallery's global preview annotations to every story run as a component test."
status: stable
---

# Gallery story test setup

> Wires the gallery preview into the Vitest component-test run.

## Purpose

Vitest setup file for the main story suite. It calls `setProjectAnnotations` with the a11y addon annotations and the gallery `preview`, so every story runs axe and inherits the same global decorators and parameters (theme wrapper, mocks) when it runs as a Vitest component test. Without the addon annotations, axe never runs. Referenced by `vitest.config.ts`.

## Exports

No public exports (internal module).

## Source

`code/projects/web/tools/storybook/.storybook/vitest.setup.ts`
