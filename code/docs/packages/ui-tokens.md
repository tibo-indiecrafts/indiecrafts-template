# `@indiecrafts/packages-shared-ui-tokens` — the design system

> **Browse it:** live token swatches (light/dark) — `pnpm storybook` ([storybook package](./storybook)).

The runtime style source + the design contract, shipped together. **One JSON source of truth
generates every platform output** — web CSS, React-Native hex, and the PWA-manifest hex mirror.

|               |                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exports**   | `./globals.css` (web — Tailwind scaffolding + `@import "./generated/tokens.css"`) · `./typeset.css` (long-form prose rhythm) · `./nativewind.css` (NativeWind hex vars) · `./native` (React-Native `{ light, dark }` hex object) · `./hex` (manifest hex mirror) · `./tokens.json` (the DTCG source)                                            |
| **Deps**      | `tailwindcss ^4`, `@tailwindcss/typography ^0.5.19`, `culori ^4` (build-time oklch→hex). **Peer:** none                                                                       |
| **Consumers** | app imports `@indiecrafts/packages-shared-ui-tokens/globals.css` in the root layout; a native app imports `./native`; the manifest reads `./hex`. Design-system source for `ui` + blog too, coupled via CSS scanning, not a JS import |

Also ships [`DESIGN.md`](../../code/packages/shared/ui-tokens/DESIGN.md) — the authoritative token
contract (colors, typography scale, spacing, a11y), colocated so contract and
implementation travel as one package.

## Token source & generation

The **source of truth is `src/shared/tokens.json`** (DTCG 2025.10, OKLCH, 3-tier
primitive→semantic→component). `pnpm tokens:build` (`scripts/build-tokens.mjs`, uses `culori`)
generates three outputs — **never hand-edit them** (a PreToolUse hook blocks it):

- `src/generated/tokens.css` — web `:root` (light) + the two dark blocks; imported by `globals.css`.
- `src/native/tokens.ts` — React Native `{ light, dark }` hex (no CSS/oklch on RN).
- `src/generated/nativewind.css` — NativeWind theme (`:root` + `.dark:root` hex vars) for
  react-native-reusables; token names match shadcn's, so native shares the palette. See
  [`ui-native`](./ui-native).
- `src/generated/hex.ts` — hex mirror the PWA manifest reads (`app/manifest.ts` can't take oklch).

`pnpm tokens:check` (in `pnpm verify` + CI) regenerates and diffs — it fails if a generated file
drifted from the JSON. Change a color: edit `tokens.json`, run `tokens:build`, then `verify:contrast`.
The 3-tier rule: **component** tokens reference only **semantic**, **semantic** only **primitive** —
never a component→primitive ref or a raw value.

## Colocated component tokens (`<Component>.tokens.json`)

A component's own themeable token surface lives **beside its `.tsx`** as a `<Component>.tokens.json`
sidecar (like `.stories.tsx`/`.md`) — every component in `ui` (61) and `ui-components` (28) ships one.
Each is a **component-tier DTCG fragment**: keys namespaced by component (`button-bg`), values
referencing only `{semantic.*}` or `{component.*}`. `tokens:build` globs `code/**/*.tokens.json` and
**merges** them into the same outputs, so a colocated token reaches web CSS **and** React Native
(resolved to hex through its semantic ref). The generator hard-errors on a duplicate name, a primitive
ref, or a non-`component` top-level key.

`tokens:check` also **drift-checks** each sidecar against its sibling `.tsx`: if the component uses a
token as a plain `bg-/text-/border-/ring-…` utility (no `/opacity`) that its sidecar omits, the check
fails, naming the file. So a sidecar can't silently fall out of sync when the component changes.
A sidecar is a **contract, not an edit** — the `ui` primitives stay shadcn-CLI-managed; the guard hook
allows `*.tokens.json` there but nothing else.

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
