# `@indiecrafts/utils` — pure helpers

The leaf brick: small, dependency-light functions, no React/Next runtime.

| | |
| --- | --- |
| **Exports** | `.` → `src/index.ts` — a barrel re-exporting `cn` · `logger` · `slugify` · `video-embed` · `consent-signals` · `format-date` |
| **Deps** | `@indiecrafts/config` (for `Locale` in `format-date`), `clsx`, `tailwind-merge` |
| **Consumers** | app + blog (`ui` also depends on it for `cn`) |

- **Gotcha:** this is the one brick you may safely barrel — it is a leaf and
  side-effect-free. Deeper bricks stay barrel-less.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](./)**.

- [`code/packages/utils/`](../../code/packages/utils/) — the source
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
