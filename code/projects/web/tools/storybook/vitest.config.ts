/**
 * Run every gallery story as a component and a11y test in a headless browser.
 *
 * @see docs/reference/projects/web/tools/storybook/vitest.config.md
 */
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

// Runs every Storybook story as a Vitest component test in a real browser
// (Playwright chromium, headless) — interaction (`play`) + a11y (addon-a11y).
// Zero new test authoring: the colocated stories (web + native via react-native-web)
// ARE the component suite. NOTE: the `stories` globs in main.ts must be configDir-
// relative — an absolute glob makes this plugin discover 0 tests (the builder tolerates
// it, this runner does not).
export default defineConfig({
  plugins: [
    storybookTest({
      configDir: fileURLToPath(new URL("./.storybook", import.meta.url)),
    }),
  ],
  test: {
    name: "storybook",
    setupFiles: [fileURLToPath(new URL("./.storybook/vitest.setup.ts", import.meta.url))],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
