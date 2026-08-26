import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

// Runs the MOBILE surface stories as component + a11y tests (the composition ref).
// Same shape as vitest.website.config.ts / vitest.app.config.ts, but points at the
// `.storybook-mobile` config.
export default defineConfig({
  plugins: [
    storybookTest({
      configDir: fileURLToPath(new URL("./.storybook-mobile", import.meta.url)),
    }),
  ],
  test: {
    name: "storybook-mobile",
    setupFiles: [fileURLToPath(new URL("./.storybook-mobile/vitest.setup.ts", import.meta.url))],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
