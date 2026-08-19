# Testing

**Principle:** many fast unit/component tests, fewer integration, few end-to-end. A bug fix
starts with a failing repro. Test **behavior, not implementation**. Full how-to (for the app):
`docs/apps/web/setup/testing.md`; the write→run→fix loop: the `test-pass` skill.

## Stack (real, installed)

| Layer                 | Tool                                                                                  | Where                                                       | Run                                                      |
| --------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| Unit / integration    | **Vitest** (happy-dom) + Testing Library                                              | colocated `*.test.ts(x)`, per-package config                | `pnpm test` (turbo fan-out)                              |
| Component + a11y      | **Storybook stories** via `addon-vitest` + `addon-a11y` (browser mode, Playwright)    | the `*.stories.tsx` — run as tests                          | `pnpm test:stories`                                      |
| E2e journeys          | **Playwright vs the running app** (seeds a throwaway `e2e` dataset, `build && start`) | `code/projects/web/surfaces/website/e2e/journeys/*.spec.ts` | `pnpm e2e`                                               |
| Visual regression     | **Playwright vs Storybook** (screenshots the built stories)                           | `e2e/visual.spec.ts` + committed baselines                  | `pnpm e2e:visual` (`e2e:update` to bless)                |
| Contrast · React · UX | `check-contrast.mjs` · react-doctor · `shadscan`                                      | scripts                                                     | `pnpm verify:contrast` · `pnpm doctor` · `pnpm shadscan` |

Vitest fans out per package via **turbo** (each package owns a `vitest.config.ts` extending the
root `vitest.shared.ts`); `pnpm test` is folded into `pnpm verify`. Story + e2e + visual suites
run in a browser, so they stay **out** of `verify` (like `build`).

## Layout

Two tiers:

- **Colocate unit / component / integration** — `*.test.ts(x)` **beside the source** it guards
  (like `*.stories.tsx`); **never** a separate `tests/` or `__tests__/` folder. The test travels
  with the code, shares its diff, and deletes with it.
- **Separate e2e** — Playwright specs live in their own `code/projects/web/surfaces/website/e2e/` folder (own config +
  CI job): they drive whole routes/journeys, not one file. Two `E2E_TARGET`s: `app` (journeys in
  `e2e/journeys/`, boots the app against a seeded throwaway dataset) + `visual` (Storybook shots).
  Role/accessible-name locators, web-first assertions, mock the boundary (`page.route('**/api/*')`) —
  the app can't SSR without a real Sanity dataset, so `page.route` can't stand in for it.

Visual = the colocated Storybook stories you already have; component behavior = the story's
`play`, run by `addon-vitest`.

## What to test (this stack)

A config-first Sanity marketing/blog site — **no auth, checkout, or money paths**. Aim at what
breaks here:

- **Unit** — pure logic + branching (`parseVideoEmbed`, `slugify`), `zod`/form validation, SEO/
  metadata builders, GROQ shape.
- **Integration** — logic that folds config/state: the blog **route-gate** (flag **and**
  `page.enabled`), **i18n key parity** across `messages/*.json`. Mock the Sanity client +
  `next/navigation` (see `vitest.setup.ts`).
- **Component + a11y** — a component's real behavior + axe, through its **story**.
- **E2e / visual** — a critical journey (nav, a form submit) + snapshot drift on the stories.
- **Skip** — static presentational components (the story + snapshot cover them), Studio config,
  generated types.

## Best practice

- Failing repro first (bug) or test-first for non-trivial logic. Don't delete a test to go green.
- **Deterministic + isolated** — no real network/dataset; mock. Story tests run in real Chromium.
- **Coverage: critical paths, no global %.** Don't chase a number; the story + visual suites guard
  the presentational surface for free.
- Visual baselines are **platform-specific** — generate them where they'll be compared (local, or
  a linux CI job/container).

## Gate

New behavior has a **colocated** test. `pnpm test` (unit + integration) is **green before
`07_SHIP`** and gates CI. Story/e2e/visual are advisory until baselines + journeys are trusted,
then graduate the gate (`.github/workflows/test.yml`).

**On-the-fly reminder.** The `change-hygiene` Stop hook (`.claude/hooks/change-hygiene.sh`, wired
in `settings.local.json`) blocks turn-end when `code/**` changes without a matching **doc and test**
— a nudge to add both, with an explicit escape for changes that genuinely need neither (config,
types, generated, presentational-only). It _reminds_; `pnpm test` + CI _run_.
