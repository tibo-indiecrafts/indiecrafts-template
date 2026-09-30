---
name: accessibility-pass
description: Run a structured accessibility pass on a page or component in this template (structure, keyboard, contrast, responsive). Use before shipping a page, or when asked for an "a11y pass", "accessibility check", or "is this accessible".
---

# Accessibility pass

Structured a11y check. Authority: `.claude/rules/web/accessibility.md`, `code/packages/web/ui-tokens/DESIGN.md`,
`code/docs/projects/web/website/design/adaptive-responsive.md`.

## Steps

1. **Structure** — one `<main id="main" tabIndex={-1}>`; `SkipLink` first → `#main`;
   `<html lang>`/`dir` from locale; sections `aria-labelledby`; icons `aria-hidden`
   unless sole label.
2. **Keyboard/focus** — every interactive element has `focus-visible:ring-2 ring-ring`;
   Radix primitives handle dialogs/menus/tabs/tooltips.
3. **Not color-alone** — status/validation pairs color with text/icon/shape.
4. **Contrast** — `pnpm verify:contrast`; fix any AA failure at the token level
   (never a one-off hex).
5. **Targets/responsive** — touch ≥ 40px; hover-only `sm:`-gated; check 375/768/1280.
6. **Semantics** — heading order, labelled fields, image alt.
7. **Lint** — `pnpm lint` (jsx-a11y errors must be zero).

For deep dives, invoke the inclusive-design skills (`accessible-content`,
`inclusive-interaction`, `cognitive-accessibility`) or the `accessibility-reviewer`
agent. Report findings most-severe first with `file:line` + fix.
