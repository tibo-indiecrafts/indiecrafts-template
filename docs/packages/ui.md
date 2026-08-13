# `@indiecrafts/ui` — design-system component layer

The 61 shadcn/ui primitives + `use-mobile`. CLI-managed — **don't hand-edit**; `shadcn add`
regenerates these files (its `components.json` aliases point here). Each primitive's usage
doc is colocated with its source (`code/packages/ui/src/<name>.md` beside `<name>.tsx`),
indexed from the [`DESIGN.md` component catalog](../../code/packages/ui-tokens/DESIGN.md).

| | |
| --- | --- |
| **Exports** | `./use-mobile` → `src/use-mobile.ts`; `./*` → `src/*.tsx` (import a primitive by name, e.g. `@indiecrafts/ui/button`) |
| **Deps** | `@indiecrafts/utils` (`cn`) + primitive libs: `@base-ui/react`, `radix-ui`, `@shadcn/react`, `class-variance-authority`, `cmdk`, `embla-carousel-react`, `input-otp`, `lucide-react`, `next-themes`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `sonner`, `vaul`; `@types/react`/`@types/react-dom` (dev). **Peer:** `react`/`react-dom 19.2.4` |
| **Consumers** | app + blog |

- **Gotcha — the wildcard only resolves single-extension `.tsx`.** `use-mobile` is a
  `.ts`, so it needs its own explicit entry.
- **Gotcha — styling lives elsewhere.** Tokens and the design contract are in `ui-tokens` +
  `DESIGN.md`, not here. Tailwind scans this source via a `@source` line in
  `ui-tokens/globals.css`.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](./)**.

- [`code/packages/ui/`](../../code/packages/ui/) — the source (primitives + colocated docs)
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
