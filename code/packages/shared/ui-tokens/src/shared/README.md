# `shared/` — reserved for the token source of truth

Today the tokens are authored directly in **web CSS** (`../globals.css`, OKLCH — authoritative per
`DESIGN.md`). When a second platform needs them (native `StyleSheet`, or a Figma/DTCG export),
promote the values to a platform-agnostic **TS source** here and generate both the CSS and the native
object from it — one home, no drift.

Empty until that second consumer exists (YAGNI). See `../native/README.md`.
