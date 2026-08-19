# `native/` — reserved for a React-Native token export

Empty on purpose. The tokens ship today as **web CSS** — `../globals.css` (OKLCH custom properties)

- `../typeset.css`. React Native has no CSS variables; it needs the same values as a **JS/TS object**
  (`{ color: { brand: "…" }, space: { … } }`) consumed by `StyleSheet`.

When a native app lands, emit that object here (`tokens.ts`) from the **same source of truth** as the
CSS — see `../shared/` — so web and native never drift. Don't hand-maintain a second copy (the
`design-token-usage` rule: never fork the tokens).

Until then keep it empty (YAGNI).
