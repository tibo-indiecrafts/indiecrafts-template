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
- **Responsive** — verified at 375 / 768 / 1280; nothing clips or reflows wrong.
- **Docs + changelog** — the matching `docs/` page **and** its sidebar updated in lockstep; the change logged in `code/apps/web/CHANGELOG.md` with a plain-language _why_.
- **Verify** — `pnpm verify:quick` (tsc + lint) passes; `pnpm verify:contrast` if tokens changed.

A screen that renders is not done. A clean tree is a shippable tree.
