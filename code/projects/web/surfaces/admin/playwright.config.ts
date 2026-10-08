import { defineConfig, devices } from "@playwright/test";

/**
 * Admin e2e — the auth-gate journeys against the running admin (`e2e/journeys/`). No seeded
 * content and no api: the gate journeys need no credentials and prove the gate fails closed.
 * `global-setup` fetches a Clerk Testing Token only when the auth keys are wired, for the
 * self-skipping signed-in journeys. Boots `next build && next start` on a dedicated port so it
 * never collides with the website (:3000) or app (:3011) e2e servers.
 */
const ADMIN_PORT = 3012;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { trace: "on-first-retry", baseURL: `http://localhost:${ADMIN_PORT}` },
  globalSetup: "./e2e/global-setup.ts",
  projects: [
    {
      name: "admin",
      testMatch: "**/journeys/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm exec next start --port ${ADMIN_PORT}`,
    // The sign-in page is the one public route, so it answers 200 whether Clerk is wired or not.
    url: `http://localhost:${ADMIN_PORT}/sign-in`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000, // a cold Next build is slow
    env: {
      NEXT_PUBLIC_ENVIRONMENT: "development",
      // Signed-in journeys (self-skip when unset): the publishable key is baked into the build
      // so the proxy gates and /sign-in renders Clerk; the secret serves server-side auth().
      // Empty → Clerk is unconfigured and the gate must still fail closed (gate.spec.ts).
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
    },
  },
});
