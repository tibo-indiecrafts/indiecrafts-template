import { defineConfig, devices } from "@playwright/test";

/**
 * App-surface e2e — real journeys against the running app (`e2e/journeys/`). Unlike the
 * website, the app has **no seeded-content dependency**: its one Sanity read (the home
 * welcome) falls back to a message-file string, so there is no dataset to seed —
 * `global-setup` only fetches a Clerk Testing Token when the auth keys are wired. Boots
 * `next build && next start` on a **dedicated port** so it never collides with the website's
 * e2e server (:3000).
 */
const APP_PORT = 3011;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { trace: "on-first-retry", baseURL: `http://localhost:${APP_PORT}` },
  globalSetup: "./e2e/global-setup.ts",
  projects: [
    {
      name: "app",
      testMatch: "**/journeys/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm exec next start --port ${APP_PORT}`,
    url: `http://localhost:${APP_PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000, // a cold Next build is slow
    env: {
      NEXT_PUBLIC_ENVIRONMENT: "development",
      // Auth journey (self-skips when unset): the publishable key is baked into the build so
      // /sign-in renders; the secret gates server-side auth(). Empty → app runs anonymous and
      // sign-in.spec.ts skips.
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
    },
  },
});
