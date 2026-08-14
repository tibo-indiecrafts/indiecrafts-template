import { defineConfig, devices } from "@playwright/test";

// E2e + visual-regression runner. Two flavours:
//  • visual  → screenshots every Storybook story from the built `storybook-static`
//              (served statically — no app, no env, self-contained).
//  • e2e     → real browser journeys against the running Next app (needs a built +
//              served app with Sanity env; run `pnpm build && pnpm start` first, or
//              let the app webServer below start it).
const STORYBOOK_PORT = 6007;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://localhost:${STORYBOOK_PORT}`, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Serve the built Storybook for the visual specs. Dependency-free static server.
  webServer: {
    command: `python3 -m http.server ${STORYBOOK_PORT} --directory ../../packages/storybook/storybook-static`,
    url: `http://localhost:${STORYBOOK_PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
