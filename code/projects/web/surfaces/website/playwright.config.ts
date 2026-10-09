import { defineConfig, devices } from "@playwright/test";
import { STORYBOOK_STATIC } from "./e2e/storybook-static";

/**
 * Two flavours of browser test, selected by `E2E_TARGET` (a webServer can't be
 * scoped to one project, so the target gates BOTH the project and its server —
 * a visual-only run never builds the app, an app-only run never needs Storybook):
 *
 *  • app     → real user journeys against the running Next app (`e2e/journeys/`).
 *              Boots `pnpm build && pnpm start` against a throwaway Sanity `tests-e2e`
 *              dataset (seeded by `global-setup`). Turnstile + RATE_LIMIT_KV are
 *              unset (template defaults), so happy paths need only email+consent.
 *  • visual  → screenshots every Storybook story from the built `storybook-static`
 *              (served statically — no app, no Sanity env, self-contained).
 *
 * `pnpm e2e` → app · `pnpm e2e:visual` → visual · no target → both.
 */
const TARGET = process.env.E2E_TARGET; // "app" | "visual" | undefined (both)
const STORYBOOK_PORT = 6007;
const APP_PORT = 3000;
const E2E_DATASET = process.env.E2E_SANITY_DATASET ?? "tests-e2e";

const runVisual = TARGET !== "app";
const runApp = TARGET !== "visual";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  // The app journeys run a production build that reads Sanity over the network on every
  // request; under parallel workers a page or a server navigation can pass the 5 s / 30 s
  // defaults (seen locally: a locale switch, a comment submit, the account erasure chain).
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: { trace: "on-first-retry" },
  // Seed the e2e dataset before the app journeys run (no-op for a visual-only run).
  globalSetup: runApp ? "./e2e/global-setup.ts" : undefined,
  projects: [
    ...(runApp
      ? [
          {
            name: "app",
            testMatch: "**/journeys/**/*.spec.ts",
            use: {
              ...devices["Desktop Chrome"],
              baseURL: `http://localhost:${APP_PORT}`,
            },
          },
        ]
      : []),
    ...(runVisual
      ? [
          {
            name: "visual",
            testMatch: "**/visual.spec.ts",
            use: {
              ...devices["Desktop Chrome"],
              baseURL: `http://localhost:${STORYBOOK_PORT}`,
            },
          },
        ]
      : []),
  ],
  webServer: [
    ...(runApp
      ? [
          {
            // Build + serve the app with the e2e dataset. NEXT_PUBLIC_* are inlined
            // at build time, so the override must be present for `build`, not just `start`.
            // keepAliveTimeout > Playwright's socket reuse: at Node's 5 s default the server
            // can close a kept-alive socket the request client is reusing ("socket hang up").
            command: "pnpm build && pnpm start --keepAliveTimeout 70000",
            url: `http://localhost:${APP_PORT}`,
            reuseExistingServer: !process.env.CI,
            // A cold Next build is slow: 259 s on a dev machine, longer on a shared CI runner.
            timeout: 600_000,
            env: {
              NEXT_PUBLIC_SANITY_DATASET: E2E_DATASET,
              NEXT_PUBLIC_ENVIRONMENT: "development",
              // Auth journey (self-skips when unset): the publishable key is baked into the
              // build so `/sign-in` renders; the secret gates server-side `auth()`. Empty →
              // the app runs anonymous exactly as today and `sign-in.spec.ts` skips.
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
                process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
              CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
            },
          },
        ]
      : []),
    ...(runVisual
      ? [
          {
            command: `python3 -m http.server ${STORYBOOK_PORT} --directory ${STORYBOOK_STATIC}`,
            url: `http://localhost:${STORYBOOK_PORT}/index.json`,
            reuseExistingServer: !process.env.CI,
            timeout: 60_000,
          },
        ]
      : []),
  ],
});
