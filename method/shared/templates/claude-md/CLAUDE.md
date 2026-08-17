# <@indiecrafts/name> — <one-line what this unit is>

Auto-loads under `<path>/**` (Claude concatenates root → area → here). This unit's _how to code_.
Design → **[`DESIGN.md`](<rel>/DESIGN.md)** · product → **[`PRODUCT.md`](<rel>/PRODUCT.md)** (if any).

**Stack:** <exact versions — e.g. Next 16.x · React 19.x · TypeScript 5.x · Tailwind 4.x>. <one line of what it is / isn't>.

## Structure

```
<a short tree of what lives where — dirs only, the important ones>
```

## Critical rules (the NEVERs)

- NEVER <the specific, verifiable restriction for this unit>.
- NEVER <…>.
- ALWAYS <the specific, verifiable requirement>.

<!-- Concrete ❌/✅ patterns for these rules live in a sibling rule file that auto-loads:
     .claude/rules/code-patterns.md (import it or keep it beside this file). -->

## Before you finish

Run the self-audit (`.claude/rules/self-review.md`) and `pnpm verify:quick`. State ✅/❌ per line.

## Pointers

- Docs (what it is) → `docs/<area>/<name>.md`
- How we build it → `method/<area>/<guide>.md`
- Log changes in this area's `CHANGELOG.md` (home altitude); roll up to root at release.
