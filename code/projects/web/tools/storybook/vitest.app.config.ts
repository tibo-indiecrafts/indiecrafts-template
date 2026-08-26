import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

// Runs the APP surface stories as component + a11y tests (the composition ref).
// Same shape as vitest.website.config.ts, but points at the `.storybook-app` config.
export default defineConfig({
  plugins: [
    storybookTest({
      configDir: fileURLToPath(new URL("./.storybook-app", import.meta.url)),
    }),
  ],
  test: {
    name: "storybook-app",
    setupFiles: [fileURLToPath(new URL("./.storybook-app/vitest.setup.ts", import.meta.url))],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
