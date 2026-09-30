---
paths:
  - "code/{projects,packages,modules}/web/**/*.{tsx,css}"
  - "code/packages/web/ui-tokens/**"
description: Use semantic tokens; never raw hex/px; map foreign tokens to roles.
---

# Design token usage

Load when touching color, type, spacing, radius, elevation, or `DESIGN.md`.

- **Use utilities / semantic tokens, never raw values** — `bg-brand`, `text-muted-foreground`, `rounded-md`. Never a raw hex/px/rem in a component.
- **The source of truth is `code/packages/web/ui-tokens/src/shared/tokens.json`** (DTCG 2025.10, OKLCH). `globals.css` and the hex mirror (`src/generated/hex.ts` — manifest + email) are **GENERATED** by `pnpm tokens:build` — **never hand-edit the generated files**. Change a color: edit the JSON (a `PostToolUse` hook nudges the rebuild), run `pnpm tokens:build`, then `pnpm verify:contrast` (WCAG AA). No more "update oklch + hex both" — the hex is computed.
- **Three tiers, one direction:** in `tokens.json`, **components** reference only **semantic** tokens, **semantics** reference only **primitives**. Never a component→primitive ref (breaks theming) or a raw value.
- **AI agents:** read `tokens.json` for color/space/type values and emit the **semantic** token (`var(--color-...)`/`bg-brand`), never an invented hex.
- **Tokens are normative.** When prose and a token disagree, the token wins; a token overrides any hardcoded value.
- **Missing token?** Name the semantic role and propose adding it to `DESIGN.md` — never bury a raw value in a component to paper over the gap.
- Full contract: `@indiecrafts/packages-web-ui-tokens/DESIGN.md`. Decision history: `code/docs/projects/web/website/design/decisions.md`.
