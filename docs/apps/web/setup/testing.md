# Testing

How this template tests itself — the layers, where tests live, how to run them, and what's
worth testing on a Sanity-backed marketing/blog site. The runners are wired; the coverage is
yours to grow.

## Layers

| Layer | Tool | Lives | Run | CI |
| --- | --- | --- | --- | --- |
| **Unit** | Vitest (happy-dom, per-package via turbo) | colocated `*.test.ts` beside source | `pnpm test` | blocks |
| **Component + a11y** | Storybook stories via `addon-vitest` + `addon-a11y` (browser/Playwright) | the `*.stories.tsx` — run as tests | `pnpm test:stories` | advisory |
| **Integration** | Vitest | colocated (`route-gate.test.ts`, config, GROQ) | `pnpm test` | blocks |
| **i18n parity** | Vitest | `messages/messages.test.ts` | `pnpm test` | blocks |
| **E2e** | Playwright | `code/apps/web/e2e/*.spec.ts` | `pnpm e2e` | advisory |
| **Visual regression** | Playwright vs Storybook | `code/apps/web/e2e/visual.spec.ts` + baselines | `pnpm e2e` | advisory |
| **A11y** | Storybook `addon-a11y` (axe) + `@axe-core/playwright` | stories + e2e | `pnpm test` / `pnpm e2e` | — |
| **Contrast** | `scripts/check-contrast.mjs` | script | `pnpm verify:contrast` | blocks |
| **Perf / React** | react-doctor | — | `pnpm doctor` | advisory |
| **Types / lint** | tsc + eslint | — | `pnpm tsc` / `pnpm lint` | blocks |

## Where tests live

**Colocated, beside the source** — the same rule the `*.stories.tsx` follow. A `button.test.tsx`
sits next to `button.tsx` and `button.stories.tsx`; a util test next to the util; the blog
route-gate test inside the blog module. There is **no** `__tests__/` directory — colocation keeps
a test with the code it guards (and keeps the blog module deletable as one folder).

**E2e is the exception:** `code/apps/web/e2e/` — full-browser specs aren't tied to one source
file, so they live in a dedicated dir with `playwright.config.ts`.

**Visual = your Storybook.** Every `@indiecrafts/ui` + `ui-components` component already has a
story; the visual suite screenshots them all, so you don't author screenshots by hand.

## Running

```bash
pnpm test              # Vitest unit + integration + parity — turbo fan-out, per-package cached
pnpm test:coverage     # same, with v8 coverage
pnpm test:stories      # every Storybook story as a component + a11y test (headless Chromium)
pnpm e2e               # Playwright: e2e journeys + visual regression
pnpm --filter @indiecrafts/web e2e:update   # (re)generate visual baselines
pnpm verify            # the full gate — now ends with `pnpm test`
```

`pnpm test` is folded into `pnpm verify` (fast + deterministic; per-package via turbo). The
browser suites — `test:stories`, `e2e`, visual — need a browser, so they stay **out** of
`verify` (like `pnpm build`), and run in the advisory CI `browser` job.

### Visual baselines are platform-specific

Playwright screenshots differ across OS/font-rendering, so a baseline made on macOS won't match
a linux CI runner. Generate baselines **on the platform that will compare them** (`pnpm e2e:update`
locally; a linux job — or container — for CI) and commit those. Until then, keep the `e2e` CI job
**advisory** (it is by default in `.github/workflows/test.yml`).

## What to test here (and what to skip)

This is a config-first marketing/blog site — no auth, no checkout, no money paths. Aim tests at
the surfaces that actually break:

**Test** — pure logic + branching (`parseVideoEmbed`, `slugify`), form/`zod` validation, the blog
**route-gate** (folds the feature flag **and** `page.enabled`), **i18n key parity** across locales,
GROQ query shape, SEO/metadata builders, and any component with real behavior (interaction, empty/
loading/error states) via its story.

**Skip** — static presentational components (a story + the visual snapshot cover them), Sanity
Studio config, and generated types. Don't chase a global coverage %; cover the **critical paths**
and let the visual suite guard the rest.

## Adding a test

Follow the `test-pass` loop: identify what changed → write the colocated test (a failing repro
first for a bug) → `pnpm test` → fix → for a new user journey, add an `e2e` spec. Adding a
component ⇒ adding its story ⇒ its visual coverage comes free.
