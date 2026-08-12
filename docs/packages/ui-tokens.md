# `@indiecrafts/ui-tokens` — the design system

The runtime style source + the design contract, shipped together. CSS-only, no JS.

| | |
| --- | --- |
| **Exports** | `./globals.css` (OKLCH color tokens, `@theme`, `@source` scan directives, base `--font-*` rules; imports Tailwind + `typeset.css`) · `./typeset.css` (long-form prose rhythm) |
| **Deps** | `tailwindcss ^4`, `@tailwindcss/typography ^0.5.19`. **Peer:** none |
| **Consumers** | app imports `@indiecrafts/ui-tokens/globals.css` in the root layout; it is the design-system source for `ui` and blog too, coupled via CSS scanning, not a JS import |

Also ships [`DESIGN.md`](../../code/packages/ui-tokens/DESIGN.md) — the authoritative token
contract (colors, typography scale, spacing, a11y), colocated so contract and
implementation travel as one package.

- **Gotcha — Tailwind v4 does not scan `node_modules`.** `globals.css` carries explicit
  `@source` lines for the app, `ui`, `ui-components`, and the blog module. **Add a `@source`
  line whenever a new package renders utility classes**, or its styles silently vanish from
  the build. The current list:

  ```css
  @import "tailwindcss";
  @source "../../../apps/web/src";
  @source "../../ui/src";
  @source "../../ui-components/src";
  @source "../../../modules/blog/src";
  @import "./typeset.css";
  ```

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule, and the four-folder mirror → **[Packages overview](./)**.

- [`code/packages/ui-tokens/`](../../code/packages/ui-tokens/) — the source (`globals.css` · `typeset.css` · `DESIGN.md`)
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
