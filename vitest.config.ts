import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Vitest — happy-dom for speed, fork pool for memory isolation between tests.
 * Stories are excluded from `pnpm test`; run them with `pnpm test:stories`
 * (browser mode via @storybook/addon-vitest, requires Playwright Chrome).
 */
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    pool: "forks",
    maxWorkers: 5,
    setupFiles: ["./tests/setup.ts"],
    clearMocks: true,
    include: ["tests/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/storybook-static/**", "**/*.stories.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "**/*.config.{ts,mjs,js}",
        "**/node_modules/**",
        "**/.next/**",
        "**/storybook-static/**",
        "**/*.stories.{ts,tsx}",
        "scripts/**",
        "src/components/ui/**",
        "src/app/**",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
