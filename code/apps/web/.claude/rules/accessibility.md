---
description: Structural a11y rules for app UI — landmarks, focus, skip-link, aria.
---

# Accessibility rules

Load when building or reviewing any UI. `jsx-a11y` rules are eslint errors.

**Structural**

- `<html lang>` + `dir` from the active locale.
- `SkipLink` first in the body, targets `#main`. Exactly one `<main id="main" tabIndex={-1}>` per layout.
- Sections use `<section aria-labelledby="…">`. Icons `aria-hidden="true"` unless they are the sole label.

**Interaction**

- Every interactive element has a visible `focus-visible:ring-2 ring-ring`.
- Never signal state by color alone — pair with text/icon/shape.
- Use the Radix primitive for dialogs/menus/tabs/tooltips (focus trap, Escape, return-focus) — don't hand-roll.
- Touch targets ≥ 40px; hover-only affordances are `sm:`-gated.

**Verify**

- **On the fly:** the `.claude/hooks/a11y-check.mjs` hook cards `jsx-a11y` findings as you edit UI (structural a11y — alt/labels/roles/aria/keyboard); the commit `lint-staged` run is the hard gate. Details → `docs/apps/web/setup/on-the-fly-checks.md`.
- `pnpm verify:contrast` gates WCAG **AA** on theme tokens — run after any color change.
- Check every change at **375 / 768 / 1280** (the floor) + a coarse-pointer (touch) device; nothing overflows or clips. Adaptive-aware layout → `rules/adaptive-design.md`.
- Deeper guide: `docs/apps/web/design/adaptive-responsive.md`.
