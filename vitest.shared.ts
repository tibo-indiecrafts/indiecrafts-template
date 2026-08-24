import { fileURLToPath } from "node:url";
import type { ViteUserConfig } from "vitest/config";

// Shared Vitest base for the happy-dom (unit / component / integration) suites.
// Each package's `vitest.config.ts` extends this via `mergeConfig`, so
// `turbo run test` fans out and caches per package — like `lint` / `tsc`.
// (The Storybook package runs stories in browser mode with its own config.)
const shared: ViteUserConfig = {
  // Packages under `code/packages/**` ship no tsconfig.json (consumed as source via
  // `transpilePackages`), so esbuild has nothing to read a `jsx` compilerOption from and
  // falls back to the classic transform (needs `React` in scope). Every .tsx source file
  // in this repo assumes the automatic runtime (matching Next's SWC config, which is where
  // they actually run) — match that here so component tests don't need a `React` import
  // no production file has.
  esbuild: { jsx: "automatic" },
  test: {
    globals: true,
    // A package can carry a `test` script before it has tests (turbo fan-out) —
    // don't fail the gate on an empty package.
    passWithNoTests: true,
    environment: "happy-dom",
    setupFiles: [fileURLToPath(new URL("./vitest.setup.ts", import.meta.url))],
    include: ["**/*.test.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/storybook-static/**",
      "**/e2e/**",
    ],
    coverage: {
      provider: "v8",
      exclude: ["**/*.stories.tsx", "**/*.test.*", "**/user-interface/ui/**"],
    },
  },
  resolve: {
    alias: {
      // Server-only guard is a no-op in tests — we exercise the pure logic directly.
      "server-only": fileURLToPath(
        new URL("./vitest/server-only-stub.ts", import.meta.url),
      ),
    },
  },
};

export default shared;
