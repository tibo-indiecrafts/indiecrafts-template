import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

// Runs the WEBSITE surface stories as component + a11y tests (the composition ref).
// Same shape as vitest.config.ts, but points at the `.storybook-website` config.
export default defineConfig({
  plugins: [
    storybookTest({
      configDir: fileURLToPath(new URL("./.storybook-website", import.meta.url)),
    }),
  ],
  test: {
    name: "storybook-website",
    setupFiles: [fileURLToPath(new URL("./.storybook-website/vitest.setup.ts", import.meta.url))],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
