# `native/` — reserved for React-Native primitives

Empty on purpose. The primitives under `../web/` are **web** — shadcn/Radix, DOM, Tailwind class
strings. React Native can't reuse them (it renders `View`/`Text`/`Pressable` via `StyleSheet`, no
DOM, no Tailwind).

When a native app lands, add RN primitives here (`native/button.tsx`, …) consuming the shared token
values (`@indiecrafts/ui-tokens`) and any platform-agnostic contract in `../shared/`. Exported as
`@indiecrafts/ui/native/<name>` — symmetric with `@indiecrafts/ui/web/<name>`.

Until then keep it empty — don't pre-scaffold (YAGNI / the repo's "extract at ≥2 consumers" rule).
