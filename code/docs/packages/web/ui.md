---
title: "@indiecrafts/packages-web-ui — design-system component layer"
description: "The 61 shadcn/ui primitives + use-mobile."
status: stable
---

# `@indiecrafts/packages-web-ui` — design-system component layer

> **Browse it:** every primitive has a live story — `pnpm storybook` ([storybook package](/projects/web/tools/storybook)).

The 61 shadcn/ui primitives + `use-mobile`. CLI-managed — **don't hand-edit**; `shadcn add`
regenerates these files (its `components.json` aliases point here). Each primitive's usage
doc is colocated with its source (`code/packages/web/ui/src/web/<name>.md` beside `<name>.tsx`),
indexed from the [`DESIGN.md` component catalog](../../code/packages/web/ui-tokens/DESIGN.md).

|               |                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exports**   | Platform-nested. `./web/use-mobile` → `src/web/use-mobile.ts`; `./web/*` → `src/web/*.tsx` (import a primitive by name, e.g. `@indiecrafts/packages-web-ui/web/button`); `./shared/*` → `src/shared/*.ts` (platform-agnostic contracts).                                                                                                                                              |
| **Deps**      | `@indiecrafts/packages-shared-utils` (`cn`) + primitive libs: `@base-ui/react`, `radix-ui`, `@shadcn/react`, `class-variance-authority`, `cmdk`, `embla-carousel-react`, `input-otp`, `lucide-react`, `next-themes`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `sonner`, `vaul`; `@types/react`/`@types/react-dom` (dev). **Peer:** `react`/`react-dom 19.2.8` |
| **Consumers** | app + blog                                                                                                                                                                                                                                                                                                                                                                            |

- **Gotcha — the wildcard only resolves single-extension `.tsx`.** `use-mobile` is a
  `.ts`, so it needs its own explicit entry.
- **Gotcha — styling lives elsewhere.** Tokens and the design contract are in `ui-tokens` +
  `DESIGN.md`, not here. Tailwind scans this source via a `@source` line in
  `ui-tokens/globals.css`.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](/packages/README)**.

- [`code/packages/web/ui/`](../../code/packages/web/ui/) — the source (primitives + colocated docs)
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
