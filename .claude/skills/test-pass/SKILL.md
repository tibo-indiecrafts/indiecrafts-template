---
name: test-pass
description: Write and run tests for a change — unit/component/integration via Vitest, e2e + visual via Playwright, on this Next.js + Sanity + Storybook stack. Use after building or fixing behavior, before shipping (parallel to accessibility-pass).
---

# Test pass

The write→run→fix loop for a change. Authority: `docs/apps/web/setup/testing.md` and the
`testing` rule. Tests are **colocated** beside the source (like `*.stories.tsx`).

## The loop

1. **Scope what changed.** New behavior or a bug fix → it gets a test. A bug starts with a
   **failing repro** (write the test that fails, then fix until green).
2. **Pick the layer** (test the behavior, not the implementation):
   - **Unit** — pure logic/branching (`parseVideoEmbed`, `slugify`), `zod`/form validation,
     GROQ shape, SEO builders. Colocated `*.test.ts`.
   - **Integration** — logic that folds config/state: the blog **route-gate** (flag **and**
     `page.enabled`), i18n **key parity** (`messages/*.json`). Colocated; mock the Sanity
     client / `next/navigation` (see `vitest.setup.ts`).
   - **Component** — a component with real behavior → assert via its **story** (run by
     Storybook `addon-vitest`) or a colocated `*.test.tsx` with Testing Library.
   - **E2e / visual** — a new user journey → a Playwright spec in `code/apps/web/e2e/`; a new
     component → its story already feeds the visual suite.
3. **Run:** `pnpm test` (Vitest) until green; `pnpm e2e` for journeys/visual (baselines via
   `pnpm --filter @indiecrafts/web e2e:update`).
4. **Fix**, don't delete the test. Re-run. `pnpm test` also runs inside `pnpm verify`.

## What to skip

Static presentational components (a story + visual snapshot cover them), Studio config, generated
types. Cover **critical paths**; don't chase a global coverage %.

## Boundaries

Review only writes tests + fixes what they catch — it doesn't reshape the code under test. If a
test is hard to write because the code is tangled, say so; don't contort the test around it.
