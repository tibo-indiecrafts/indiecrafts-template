import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { coverageConfigDefaults, type ViteUserConfig } from "vitest/config";

// Coverage floors, enforced only on a `--coverage` run (CI `verify`). Keyed by package
// name, so one table here covers every package that extends this base; a package not
// listed has no floor. Each floor = the measured value minus 3 points, rounded down.
// Statements track lines (v8 reports them equal here).
// Measured 2026-10-08 (lines · branches · functions, %):
//   web-surfaces-app 34.49 · 86.00 · 69.35       web-surfaces-website 12.11 · 71.34 · 68.08
//   web-surfaces-admin 53.26 · 78.12 · 64.12     packages-shared-security 95.70 · 86.58 · 96.49
//   packages-shared-compliance 80.61 · 85.81 · 88.57   packages-shared-config 88.65 · 92.45 · 73.68
// Raise a floor when coverage rises; never lower one to pass a PR.
const COVERAGE_FLOORS: Record<
  string,
  { lines: number; branches: number; functions: number }
> = {
  "@indiecrafts/web-surfaces-app": { lines: 31, branches: 83, functions: 66 },
  "@indiecrafts/web-surfaces-website": {
    lines: 9,
    branches: 68,
    functions: 65,
  },
  "@indiecrafts/web-surfaces-admin": { lines: 50, branches: 75, functions: 61 },
  "@indiecrafts/packages-shared-security": {
    lines: 92,
    branches: 83,
    functions: 93,
  },
  "@indiecrafts/packages-shared-compliance": {
    lines: 77,
    branches: 82,
    functions: 85,
  },
  "@indiecrafts/packages-shared-config": {
    lines: 85,
    branches: 89,
    functions: 70,
  },
};
// Vitest runs from the package dir (turbo and `pnpm --filter … exec` both do).
const floor =
  COVERAGE_FLOORS[
    (
      JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
        name: string;
      }
    ).name
  ];

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
      // Keep Vitest's defaults (dot-dirs like `.next/` — whose missing source maps crash
      // the v8 report — config files, `.d.ts`) and add ours.
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.stories.tsx",
        "**/user-interface/ui/**",
        "**/e2e/**",
        "**/storybook-static/**",
      ],
      thresholds: floor && { ...floor, statements: floor.lines },
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
