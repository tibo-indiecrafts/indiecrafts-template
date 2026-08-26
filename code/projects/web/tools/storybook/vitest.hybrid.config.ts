import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

// Runs the HYBRID surface stories as component + a11y tests (the composition ref).
// Same shape as vitest.website.config.ts / vitest.app.config.ts / vitest.mobile.config.ts,
// but points at the `.storybook-hybrid` config.
export default defineConfig({
  plugins: [
    storybookTest({
      configDir: fileURLToPath(new URL("./.storybook-hybrid", import.meta.url)),
    }),
  ],
  test: {
    name: "storybook-hybrid",
    setupFiles: [fileURLToPath(new URL("./.storybook-hybrid/vitest.setup.ts", import.meta.url))],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
