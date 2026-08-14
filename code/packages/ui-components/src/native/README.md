# `native/` — reserved for a React-Native renderer set

Empty on purpose. The `@indiecrafts/ui-components` renderers under `../web/` are **web** — Tailwind
class strings, DOM elements, `next/image`, `@portabletext/react`. React Native can't reuse them
(it renders `View`/`Text`/`StyleSheet`, no DOM, no Tailwind classes).

When a native app lands, mirror the **same domain folders** here (`native/content/`, `native/media/`,
`native/collection/`, `native/layout/`) with RN implementations, sharing the platform-agnostic
**contract**:

- block types → `../shared/types.ts`
- design tokens → `@indiecrafts/ui-tokens`
- a per-platform registry → mirror `../web/registry.tsx`.

Until then keep it empty — don't pre-scaffold empty domain files (YAGNI / the repo's "extract at
≥2 consumers" rule).
