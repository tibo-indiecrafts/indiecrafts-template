---
title: "Testing"
description: "How this template tests itself — the layers, where tests live, how to run them, and what's worth testing on a Sanity-backed marketing/blog site."
status: stable
---

# Testing

How this template tests itself — the layers, where tests live, how to run them, and what's
worth testing on a Sanity-backed marketing/blog site. The runners are wired; the coverage is
yours to grow.

## Layers

| Layer                 | Tool                                                                     | Lives                                                                  | Run                      | CI                    |
| --------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------ | --------------------- |
| **Unit**              | Vitest (happy-dom, per-package via turbo)                                | colocated `*.test.ts` beside source                                    | `pnpm test`              | blocks                |
| **Component + a11y**  | Storybook stories via `addon-vitest` + `addon-a11y` (browser/Playwright) | the `*.stories.tsx` — run as tests                                     | `pnpm test:stories`      | advisory              |
| **Integration**       | Vitest                                                                   | colocated (`route-gate.test.ts`, config, GROQ, `api/**/route.test.ts`) | `pnpm test`              | blocks                |
| **i18n parity**       | Vitest                                                                   | `messages/messages.test.ts`                                            | `pnpm test`              | blocks                |
| **E2e journeys**      | Playwright vs the running app                                            | `code/projects/web/surfaces/website/e2e/journeys/*.spec.ts`            | `pnpm e2e`               | blocking (functional) |
| **Visual regression** | Playwright vs Storybook                                                  | `code/projects/web/surfaces/website/e2e/visual.spec.ts` + baselines    | `pnpm e2e:visual`        | advisory              |
| **A11y**              | Storybook `addon-a11y` (axe) + `@axe-core/playwright`                    | stories + e2e                                                          | `pnpm test` / `pnpm e2e` | —                     |
| **Contrast**          | `scripts/check-contrast.mjs`                                             | script                                                                 | `pnpm verify:contrast`   | blocks                |
| **Perf / React**      | react-doctor                                                             | —                                                                      | `pnpm doctor`            | advisory              |
| **Types / lint**      | tsc + eslint                                                             | —                                                                      | `pnpm tsc` / `pnpm lint` | blocks                |

## Where tests live

**Colocated, beside the source** — the same rule the `*.stories.tsx` follow. A `button.test.tsx`
sits next to `button.tsx` and `button.stories.tsx`; a util test next to the util; the blog
route-gate test inside the blog module. There is **no** `__tests__/` directory — colocation keeps
a test with the code it guards (and keeps the blog module deletable as one folder).

**E2e is the exception:** `code/projects/web/surfaces/website/e2e/` — full-browser specs aren't tied to one source
file, so they live in a dedicated dir with `playwright.config.ts`. **App journeys** sit in
`e2e/journeys/*.spec.ts`; the Storybook visual spec stays at `e2e/visual.spec.ts`.

**Visual = your Storybook.** Every `@indiecrafts/packages-web-ui` + `ui-components` component already has a
story; the visual suite screenshots them all, so you don't author screenshots by hand.

## Running

```bash
pnpm test              # Vitest unit + integration + parity — turbo fan-out, per-package cached
pnpm test:coverage     # same, with v8 coverage
pnpm test:stories      # every Storybook story as a component + a11y test (headless Chromium)
pnpm --filter @indiecrafts/web-surfaces-website e2e          # app journeys — seeds an `e2e` dataset, builds + serves the app
pnpm --filter @indiecrafts/web-surfaces-website e2e:visual   # visual regression against the built Storybook
pnpm --filter @indiecrafts/web-surfaces-website e2e:update   # (re)generate visual baselines
pnpm verify            # the full gate — now ends with `pnpm test`
```

`pnpm test` is folded into `pnpm verify` (fast + deterministic; per-package via turbo). The
browser suites — `test:stories`, `e2e`, visual — need a browser, so they stay **out** of
`verify` (like `pnpm build`), and run in the advisory CI `browser` job.

### API route tests — one per `/api/**` handler

Every route under `src/app/api/` has a colocated `route.test.ts`. Each test calls the exported
handler (`POST` / `GET`) with a plain `Request` and asserts the **route's own** behaviour, not the
engine's:

- **Feature gate** — the flag off (or the Studio `enabled` toggle off) → `404`, and the engine is never called.
- **Boundary** — `withGuard` rejects a cross-site post (`403`), an oversize body (`413`) and malformed JSON (`400`) before the engine.
- **Outcomes** — `invalid` → `400`; a real and a spam-dropped submit answer the same `201`, so a bot learns nothing.
- **Auth** — Clerk `auth()` mocked signed out → `401` (`session-log`); the user id comes from `auth()`, never from the body (`consent-log`).
- **Secrets** — the policy version is the server's (a forged one in the body is ignored); `RESEND_API_KEY` and the Sanity read token never appear in a response.

How they mock:

- The first line is `// @vitest-environment node`. happy-dom's `Request` drops forbidden headers such as `Sec-Fetch-Site`, so the cross-site check would not run.
- `vi.mock` replaces each module the route calls (the engine, `next/headers`, `@clerk/nextjs/server`, the Sanity reads).
- `@indiecrafts/packages-shared-security/rate-limit` is mocked to allow.
- A flag is flipped through a getter on a mocked `@/config` `features`.
- No test reaches the network, Sanity, Clerk or Resend. `emails/test` stubs the global `fetch` for Sanity's `users/me`.

### Mobile shell (Capacitor) — `node --test`, not Vitest

The **mobile** shell has no UI, so its suite is small: `node --test` over `src/*.test.ts` and
`scripts/*.test.mjs`. Run with `pnpm --filter @indiecrafts/mobile-surfaces-main test`; it is folded
into that app's `verify` (`tsc && test`), so `pnpm verify` covers it via the turbo fan-out. The screens
live in the `app` surface and are tested there.

### Visual baselines are platform-specific

Playwright screenshots differ across OS/font-rendering, so a baseline made on macOS won't match
a linux CI runner (the file names carry the platform: `<story-id>-visual-linux.png`). CI makes the
linux set for you: the `browser-e2e-visual` job writes every missing baseline and uploads them as
the **`visual-baselines-linux`** artifact. To graduate the gate:

1. Let the job run once on a pushed branch.
2. Download the artifact and commit its files to
   `code/projects/web/surfaces/website/e2e/visual.spec.ts-snapshots/`.
3. Remove `continue-on-error: true` from `browser-e2e-visual` in `.github/workflows/test.yml`.

After an intended visual change, download the job's artifact the same way (delete the stale
`.png` first so the job rewrites it), or run `pnpm e2e:update` in a linux container. The suite
runs **one test per story**, read from `storybook-static/index.json` (`e2e/storybook-static.ts`
holds the path), so every changed story is reported, not only the first.

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

**The journeys** — `api-guard` (every public `withGuard` route — `waitlist` · `newsletter` ·
`newsletter/confirm` · `comments` · `contact` · `data-request` · `views` — answers 403 cross-site · 413
oversize · 400 invalid input, all before any write; the allowlisted routes assert their own rejection:
`comments/moderate` 400 on an unknown action, `emails/test` 401 without an editor token, and with Clerk
keys `session-log` 401 signed out and `consent-log` 413 oversize), `contact` · `data-request` (consent and
required-field gates, success + error states; the api route is stubbed), `erasure` (`/erasure` and
`/erasure/confirm` — the worker calls are stubbed, each api answer maps to its message, the emailed token
travels only in the POST body; self-skips when the build has no `NEXT_PUBLIC_API_URL`), `account` (a
signed-out visitor never reaches export/delete), `account-data` (signed in: export answers a
single-use link to the user's own data, delete refuses a mismatched email, then erases the account and
signs out — a throwaway `+clerk_test` user per run (`e2e/clerk-user.ts`);
self-skips without Clerk keys or `NEXT_PUBLIC_API_URL`, and needs the api running, e.g. `pnpm dev`), `newsletter`, `download` (a gated lead-magnet `/api/download` returns 403 on a bad/missing token, no CDN URL
leaked), `waitlist`, `consent`, `a11y` (skip-link + axe), `theme`, `not-found`, plus content-dependent
`blog-read` · `comment` · `search` · `i18n` · `route-gate` (a default-off route 404s), plus
`sign-in` (the **auth** journey — self-skips without Clerk keys; see below). Content journeys rely on
the seeded posts; the deterministic ones (`api-guard`, `download`, `account`, `erasure`, `data-request`, `a11y`, `not-found`, `route-gate`)
need only the app booted.

**Timeouts:** 15 s per assertion and 60 s per test (`playwright.config.ts`): the journeys run a
production build that reads Sanity on every request, under parallel workers. The e2e server runs
`next start --keepAliveTimeout 70000`, because at Node's 5 s default the request client can reuse a
socket the server just closed ("socket hang up").

**Env for `pnpm e2e`:** `NEXT_PUBLIC_SANITY_PROJECT_ID` + `SANITY_API_WRITE_TOKEN` (to seed);
`E2E_SANITY_DATASET` overrides the dataset, `E2E_SKIP_SEED=1` reuses an already-seeded one.

::: warning One-time setup — the `e2e` dataset must exist first
`global-setup` **imports** into the throwaway `e2e` dataset; it can't **create** it, and a content
`SANITY_API_WRITE_TOKEN` lacks the `datasets/create` grant. So **before the app journeys can run**
(locally or in CI), someone with dataset-admin rights (a `sanity login` session, or a robot token with
that grant) creates it **once**:

```bash
pnpm --filter @indiecrafts/web-surfaces-website exec sanity dataset create e2e --visibility private
```

On a Sanity plan without private datasets, the CLI creates it **public** (a warning, not an
error). It holds only the seeded demo content.

Until it exists, every app-journey run fails at seed with a clear message. In CI, the token behind
`SANITY_API_WRITE_TOKEN` must either have the grant or the dataset must be pre-created.
:::

### Auth E2E (Clerk) — `sign-in.spec.ts`

The one journey that exercises **sign-in**. It uses Clerk **Testing Tokens** (`@clerk/testing`) to
bypass bot detection and a `+clerk_test` identity (a Clerk dev/test instance accepts the fixed code
`424242`), so **no real user or credentials exist**. It asserts the session at the framework level
(`window.Clerk.user`) — not the prebuilt `<SignIn>` DOM — so it stays stable. It **self-skips** unless
a Clerk instance is wired, so CI and local runs stay green until you set the keys.

Setup — **use any Clerk NON-production instance** (`pk_test_…` / `sk_test_…`). The dev keys you
already run the app with work as-is; no new instance is required. (A separate _test_ instance is
optional, only to keep test users out of your dev data.) Never use production (`pk_live`/`sk_live`).

1. **Clerk dashboard** (once, on that instance): confirm **Email address** is an identifier with
   **Email verification code** enabled — the passwordless flow the journey drives (the default). No
   test user to create by hand: Clerk signs in existing users only, so each run creates its own
   `+clerk_test` user through the Backend API (`e2e/clerk-user.ts`) and deletes it after. The code is
   always `424242`.
2. **CI** — add two repo **Secrets**: `E2E_CLERK_PUBLISHABLE_KEY` = your `pk_test_…`,
   `E2E_CLERK_SECRET_KEY` = your `sk_test_…`. The `browser-e2e-app` job injects them; the journey then
   runs and gates.
3. **Local** — the keys in `website/.env.local` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` +
   `CLERK_SECRET_KEY`) are picked up automatically when you export them into the run:
   ```bash
   set -a; . ./.env.local; set +a
   pnpm --filter @indiecrafts/web-surfaces-website e2e   # runs every journey incl. sign-in
   ```

Until the keys are present the journey is skipped and everything else runs unchanged.

### App surface e2e

The `app` surface has its own minimal Playwright setup —
`code/projects/web/surfaces/app/playwright.config.ts` + `e2e/journeys/` (`version` · `not-found` ·
`boot` · `sign-in`), run with `pnpm --filter @indiecrafts/web-surfaces-app e2e`. **No dataset to
seed** — the app's one Sanity read (home welcome) falls back to a message string — so its
`global-setup` only fetches a Clerk Testing Token, and it boots on a **dedicated port (:3011)** so it
never collides with the website server. Auth reuses the same `sign-in.spec.ts` pattern (self-skips
without Clerk keys). Wired into the CI `browser-e2e-app` job alongside the website. (`admin` has no
e2e yet.)

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
