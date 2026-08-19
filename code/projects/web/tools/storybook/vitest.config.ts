import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

// Runs every Storybook story as a Vitest component test in a real browser
// (Playwright chromium, headless) — interaction (`play`) + a11y (addon-a11y).
// Zero new test authoring: the 127 colocated stories ARE the component suite.
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
