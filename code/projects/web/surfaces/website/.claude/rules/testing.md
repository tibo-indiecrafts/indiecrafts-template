---
description: What to test + how — colocate unit/component, separate e2e, behavior not implementation, bug = failing repro first.
---

# Testing rules

Load when writing or changing tests, or when a change adds/alters behavior. Full guide:
`code/docs/apps/web/setup/testing.md`; the write→run→fix loop: the `test-pass` skill.

- **Colocate unit / component / integration** — `*.test.ts(x)` sits **beside the source** it guards (like `*.stories.tsx`); **never** a separate `tests/` or `__tests__/` folder. The test travels with the code, shows in the same diff, and deletes with it.
- **Separate e2e** — Playwright specs live in their own `code/projects/web/surfaces/website/e2e/` folder (own config, own CI job): they drive whole routes/journeys, not one file. Visual = the colocated Storybook stories, no separate files.
- **Test behavior, not implementation** — assert observable output/effects, not internal calls. A component's real behavior is tested through its **story** (a `play` interaction, run by Storybook `addon-vitest`) or Testing Library; static presentation is covered by the visual snapshot.
- **A bug fix starts with a failing repro** — write the test that reproduces it, then fix until green. Don't delete a test to make the suite pass.
- **Test what breaks here** — pure logic/branching, `zod`/form validation, the blog route-gate (flag **and** `page.enabled`), i18n key parity, GROQ shape, SEO builders. **Skip** static presentational components, Studio config, generated types.
- **Deterministic + isolated** — no network/real dataset; mock the Sanity client + `next/navigation` (see `vitest.setup.ts`). No global coverage %; cover the critical paths.
- **Run** — `pnpm test` (folded into `pnpm verify`); `pnpm e2e` for journeys/visual (baselines are platform-specific — regenerate with `e2e:update`).
