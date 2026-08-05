# Design token usage

Load when touching color, type, spacing, radius, elevation, or `DESIGN.md`.

- **Use utilities, never raw values** — `bg-brand`, `text-muted-foreground`,
  `rounded-md`. Never a raw hex/px/rem in a component.
- **OKLCH is authoritative** (`src/app/globals.css`). The hex in `DESIGN.md`
  front-matter and `theme.hexColors` are sRGB **mirrors** for tooling
  (`next/og` Satori can't parse `oklch`; PWA manifest). Change a color → update
  both, then run `pnpm verify:contrast` (WCAG AA).
- **Never fork the tokens** into a hand-maintained `design-tokens.json`. If a
  Figma/DTCG export is needed, generate it from the OKLCH tokens.
- **Tokens are normative.** When prose and a token disagree, the token wins; a
  token overrides any hardcoded value.
- **Missing token?** Name the semantic role and propose adding it to `DESIGN.md`
  — never bury a raw value in a component to paper over the gap.
- Full contract: `DESIGN.md`. Decision history: `docs/design-decisions.md`.
