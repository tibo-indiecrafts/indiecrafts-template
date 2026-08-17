# Packages — shared-brick method

How to build a shared package (schema · ui · config · sdk…) — typed contracts,
internal-TS packages, boundaries. Mirrors `code/packages/`.

- [`api-and-data.md`](./api-and-data) — API surface + data layer (validation, one client).

## Multi-platform component organization (platform → domain)

The design-system renderers (`@indiecrafts/ui-components`) are organized **platform → domain**:
`src/renderers/web/<domain>/` (`content · media · collection · layout`), with `renderers/native/`
**reserved** and empty. Rationale + the "when to split" rule:

- **Domain is the stable, platform-agnostic axis** — a `Callout` is a callout on any platform. Keep
  it the inner folder now; it never moves.
- **Platform is the outer axis, added only when a second platform exists.** Web renderers (Tailwind
  classes, DOM, `next/image`) **cannot** be reused by React Native (`View`/`Text`/`StyleSheet`), so a
  native app needs its own renderer set — a `native/<domain>/` mirror that shares the **contract**
  (`src/types.ts` block types + `@indiecrafts/ui-tokens` design tokens + the registry shape), not the
  markup. Build it when the RN app is real, not before (the ≥2-consumers rule) — an empty `native/`
  today is scaffolding, not architecture.
- **Share the contract, fork the renderers** is the pattern for every future cross-platform brick.

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Netlify/Vercel dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
