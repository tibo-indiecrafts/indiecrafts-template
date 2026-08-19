# `@indiecrafts/ui-tokens` — the design system

> **Browse it:** live token swatches (light/dark) — `pnpm storybook` ([storybook package](./storybook)).

The runtime style source + the design contract, shipped together. CSS-only, no JS.

|               |                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exports**   | `./globals.css` (OKLCH color tokens, `@theme`, `@source` scan directives, base `--font-*` rules; imports Tailwind + `typeset.css`) · `./typeset.css` (long-form prose rhythm) |
| **Deps**      | `tailwindcss ^4`, `@tailwindcss/typography ^0.5.19`. **Peer:** none                                                                                                           |
| **Consumers** | app imports `@indiecrafts/ui-tokens/globals.css` in the root layout; it is the design-system source for `ui` and blog too, coupled via CSS scanning, not a JS import          |

Also ships [`DESIGN.md`](../../code/packages/shared/ui-tokens/DESIGN.md) — the authoritative token
contract (colors, typography scale, spacing, a11y), colocated so contract and
implementation travel as one package.

- **Gotcha — Tailwind v4 does not scan `node_modules`.** `globals.css` carries explicit
  `@source` lines for the app, the design-system bricks (`ui`, `ui-components`), every domain
  brick that renders classes (`version`, `compliance`, `announcement`, `locale-suggest`,
  `system-pages`), and the feature modules (`blog`, `newsletter`, `waitlist`). **Add a `@source`
  line whenever a new package renders utility classes**, or its styles silently vanish from
  the build. The current list:

  ```css
  @import "tailwindcss";
  @source "../../../../projects/web/src";
  @source "../../../web/ui/src";
  @source "../../../web/ui-components/src";
  @source "../../../web/version/src";
  @source "../../../web/compliance/src";
  @source "../../../web/announcement/src";
  @source "../../../web/locale-suggest/src";
  @source "../../../web/system-pages/src";
  @source "../../../../modules/web/blog/src";
  @source "../../../../modules/web/newsletter/src";
  @source "../../../../modules/web/waitlist/src";
  @plugin "@tailwindcss/typography";
  @import "./typeset.css";
  ```

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](./)**.

- [`code/packages/shared/ui-tokens/`](../../code/packages/shared/ui-tokens/) — the source (`globals.css` · `typeset.css` · `DESIGN.md`)
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
