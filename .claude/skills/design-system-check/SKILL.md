---
name: design-system-check
description: Run a design-system compliance pass on UI changes in this template — verifies tokens, reuse, and contrast against code/packages/web/ui-tokens/DESIGN.md. Use before shipping any UI, or when asked to "check the design system", "review tokens", or "is this on-system".
---

# Design-system check

A repeatable pass to confirm a UI change is on-system. Authority: `code/packages/web/ui-tokens/DESIGN.md`,
`code/packages/web/ui-tokens/src/globals.css`, `.claude/rules/web/design-token-usage.md`,
`.claude/rules/web/component-architecture.md`.

## Steps

1. **Scope** — `git diff --name-only` for changed `.tsx`/`.css` under `src/`.
2. **Raw values** — grep the diff for hardcoded color/size where a token exists:
   `grep -nE '#[0-9a-fA-F]{3,6}|\b[0-9]+px\b'` → each should be a utility/token.
3. **Token roles** — confirm `brand` only marks the one important thing; only
   `foreground`/`muted-foreground` greys; no mixed `rounded` scales; flat cards
   use `ring-1 ring-border/60 shadow-sm`, not drop-shadows.
4. **Reuse** — did this duplicate an existing part or fork instead of adding a
   `cva` variant? Prefer reuse → variant → wrap → compose → new.
5. **Type scale** — every text size maps to a named token.
6. **Forbidden edits** — no changes under `src/user-interface/ui/**`.
7. **Contrast** — if any color changed, run `pnpm verify:contrast` (WCAG AA).
8. **Gate** — run `pnpm verify:quick`.

Report findings most-severe first with `file:line` + fix. For a second opinion,
delegate to the `design-system-reviewer` agent.
