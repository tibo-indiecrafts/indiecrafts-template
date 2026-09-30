/**
 * Run every gallery story as a component and a11y test in a headless browser, in light and dark.
 *
 * @see docs/reference/projects/web/tools/storybook/vitest.config.md
 */
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

// Runs every Storybook story as a Vitest component test in a real browser
// (Playwright chromium, headless) — interaction (`play`) + a11y (addon-a11y, `test: "error"`).
// Zero new test authoring: the colocated stories (web bricks)
// ARE the component suite. Two projects: the default Light theme and Dark — axe contrast
// differs per theme. NOTE: the `stories` globs in main.ts must be configDir-
// relative — an absolute glob makes this plugin discover 0 tests (the builder tolerates
// it, this runner does not).
const configDir = fileURLToPath(new URL("./.storybook", import.meta.url));
const project = (name: string, setup: string) => ({
  plugins: [storybookTest({ configDir })],
  test: {
    name,
    setupFiles: [fileURLToPath(new URL(setup, import.meta.url))],
    // Two themes double the browser load; a slow render must not flake the gate.
    testTimeout: 30_000,
    browser: {
      enabled: true,
      provider: "playwright" as const,
      headless: true,
      instances: [{ browser: "chromium" as const }],
    },
  },
});

export default defineConfig({
  test: {
    projects: [
      project("storybook", "./.storybook/vitest.setup.ts"),
      project("storybook-dark", "./.storybook/vitest.setup.dark.ts"),
    ],
  },
});
