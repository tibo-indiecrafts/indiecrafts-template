---
description: Pre-finish self-audit for app work — state ✅/❌ per line before calling a task done.
---

# Self-review (before you finish)

Before calling an app task complete, **state ✅ or ❌ for each** — a ❌ is unfinished work, not
a footnote:

- **Reused** existing parts/tokens — no near-duplicate component or grey.
- **Tokens only** — no raw hex/px/font; any genuinely new token surfaced, not buried (see `code-patterns`).
- **Errors handled** — no swallowed catch; `logger.error` minimum; loading/empty/error states covered.
- **i18n** — every user-facing string in `messages/<locale>.json`; `@/i18n/routing` (not `next/link`); `setRequestLocale` at the top of server components using translations.
- **A11y** — keyboard + visible `focus-visible` ring; no state by color alone; one `<main id="main">`; icons `aria-hidden` unless the label.
- **Adaptive-aware** — named the mechanism (reflow vs context-swap); each device class deliberate; input-method (`pointer`/`hover`) handled, not hover-gated; container queries where a component's own width drives layout; verified at 375 / 768 / 1280 + a touch device (see `adaptive-design`).
- **Docs + changelog** — the matching `docs/` page **and** its sidebar updated in lockstep; the change logged in `code/projects/web/surfaces/website/CHANGELOG.md` with a plain-language _why_.
- **Looked at it** — for any UI change, **screenshotted the rendered pixels at 375 / 768 / 1280** and reviewed the *images* (not the DOM) for overlap, clipping, off-centre, low-contrast / dark-mode grey-on-grey. Green tests don't prove a human can see it. See [`visual-verification`](./visual-verification.md).
- **Test** — added or updated a test for the new behavior (a colocated `*.test.*`, or an `e2e/journeys/` spec), or explicitly waived it (config / types / generated / presentational-only). The `change-hygiene` Stop gate enforces the docs **and** test nudge.
- **Verify** — `pnpm verify:quick` (tsc + lint) passes; `pnpm verify:contrast` if tokens changed.

A screen that renders is not done — **a screen you have not looked at is not done.** A clean tree is a shippable tree.
