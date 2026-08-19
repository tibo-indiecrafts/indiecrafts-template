# Testing

How this template tests itself — the layers, where tests live, how to run them, and what's
worth testing on a Sanity-backed marketing/blog site. The runners are wired; the coverage is
yours to grow.

## Layers

| Layer                 | Tool                                                                     | Lives                                                               | Run                      | CI       |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------ | -------- |
| **Unit**              | Vitest (happy-dom, per-package via turbo)                                | colocated `*.test.ts` beside source                                 | `pnpm test`              | blocks   |
| **Component + a11y**  | Storybook stories via `addon-vitest` + `addon-a11y` (browser/Playwright) | the `*.stories.tsx` — run as tests                                  | `pnpm test:stories`      | advisory |
| **Integration**       | Vitest                                                                   | colocated (`route-gate.test.ts`, config, GROQ)                      | `pnpm test`              | blocks   |
| **i18n parity**       | Vitest                                                                   | `messages/messages.test.ts`                                         | `pnpm test`              | blocks   |
| **E2e journeys**      | Playwright vs the running app                                            | `code/projects/web/surfaces/website/e2e/journeys/*.spec.ts`         | `pnpm e2e`               | advisory |
| **Visual regression** | Playwright vs Storybook                                                  | `code/projects/web/surfaces/website/e2e/visual.spec.ts` + baselines | `pnpm e2e:visual`        | advisory |
| **A11y**              | Storybook `addon-a11y` (axe) + `@axe-core/playwright`                    | stories + e2e                                                       | `pnpm test` / `pnpm e2e` | —        |
| **Contrast**          | `scripts/check-contrast.mjs`                                             | script                                                              | `pnpm verify:contrast`   | blocks   |
| **Perf / React**      | react-doctor                                                             | —                                                                   | `pnpm doctor`            | advisory |
| **Types / lint**      | tsc + eslint                                                             | —                                                                   | `pnpm tsc` / `pnpm lint` | blocks   |

## Where tests live

**Colocated, beside the source** — the same rule the `*.stories.tsx` follow. A `button.test.tsx`
sits next to `button.tsx` and `button.stories.tsx`; a util test next to the util; the blog
route-gate test inside the blog module. There is **no** `__tests__/` directory — colocation keeps
a test with the code it guards (and keeps the blog module deletable as one folder).

**E2e is the exception:** `code/projects/web/surfaces/website/e2e/` — full-browser specs aren't tied to one source
file, so they live in a dedicated dir with `playwright.config.ts`. **App journeys** sit in
`e2e/journeys/*.spec.ts`; the Storybook visual spec stays at `e2e/visual.spec.ts`.

**Visual = your Storybook.** Every `@indiecrafts/ui` + `ui-components` component already has a
story; the visual suite screenshots them all, so you don't author screenshots by hand.

## Running

```bash
pnpm test              # Vitest unit + integration + parity — turbo fan-out, per-package cached
pnpm test:coverage     # same, with v8 coverage
pnpm test:stories      # every Storybook story as a component + a11y test (headless Chromium)
pnpm --filter @indiecrafts/website e2e          # app journeys — seeds an `e2e` dataset, builds + serves the app
pnpm --filter @indiecrafts/website e2e:visual   # visual regression against the built Storybook
pnpm --filter @indiecrafts/website e2e:update   # (re)generate visual baselines
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

### End-to-end journeys (Playwright vs the running app)

`playwright.config.ts` runs **two targets**, gated by `E2E_TARGET` (a webServer can't be scoped to
one project, so the target picks both the project and its server):

- **`app`** (`pnpm e2e`) — journeys in `e2e/journeys/`. A `global-setup` seeds a **throwaway `e2e`
  Sanity dataset** (reusing `scripts/seed-demo.mjs` — never `production`), then the webServer runs
  `pnpm build && pnpm start` against it. **The app can't boot without a real dataset** — server
  components fetch Sanity during SSR, which Playwright `page.route()` can't intercept.
- **`visual`** (`pnpm e2e:visual`) — the Storybook screenshot suite (no app, no Sanity).

**Principles** (Playwright's own): assert user-visible behavior; locate by **role / accessible name**
(`getByRole('button', { name })`), never CSS/XPath; **web-first assertions** (`await expect(x).toBeVisible()`,
no `waitForTimeout`); **mock the boundary, not the middle** — `page.route('**/api/*')` fulfils a
201 so a happy-path submit writes nothing; Turnstile + `RATE_LIMIT_KV` are off by default, so a
form's submit enables on email + consent alone. `trace: on-first-retry`.

**The journeys** — `api-guard` (403 cross-site · 413 oversize · 400 bad email, all before any Sanity
write), `download` (a gated lead-magnet `/api/download` returns 403 on a bad/missing token, no CDN URL
leaked), `waitlist`, `consent`, `a11y` (skip-link + axe), `theme`, `not-found`, plus content-dependent
`blog-read` · `comment` · `search` · `i18n` · `route-gate` (a default-off route 404s). Content
journeys rely on the seeded posts; the deterministic ones (`api-guard`, `download`, `a11y`,
`not-found`, `route-gate`) need only the app booted.

**Env for `pnpm e2e`:** `NEXT_PUBLIC_SANITY_PROJECT_ID` + `SANITY_API_WRITE_TOKEN` (to seed);
`E2E_SANITY_DATASET` overrides the dataset, `E2E_SKIP_SEED=1` reuses an already-seeded one.

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
first for a bug) → `pnpm test` → fix → for a new user journey, add a spec in `e2e/journeys/`. Adding a
component ⇒ adding its story ⇒ its visual coverage comes free. An **interactive** component also gets a
`play` in its story — it drives itself by role and asserts behavior (opens a menu, gates a submit),
run in Chromium by `addon-vitest` under `pnpm test:stories` (the advisory `browser` job, not `pnpm test`).
