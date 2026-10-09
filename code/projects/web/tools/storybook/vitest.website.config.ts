/**
 * Run the website-surface stories as component and a11y tests in a headless browser, in light and dark.
 *
 * @see docs/reference/projects/web/tools/storybook/vitest.website.config.md
 */
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

// Runs the WEBSITE surface stories as component + a11y tests (the composition ref).
// Same shape as vitest.config.ts — a Light and a Dark project — but points at the
// `.storybook-website` config.
const configDir = fileURLToPath(new URL("./.storybook-website", import.meta.url));
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
      project("storybook-website", "./.storybook-website/vitest.setup.ts"),
      project("storybook-website-dark", "./.storybook-website/vitest.setup.dark.ts"),
    ],
  },
});
