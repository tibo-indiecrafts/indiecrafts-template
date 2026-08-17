import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

/**
 * Seed the throwaway `e2e` Sanity dataset before the app journeys run — reuses
 * the existing `scripts/seed-demo.mjs` (no bespoke fixture framework). Idempotent:
 * the seeder upserts, so re-running is safe.
 *
 * Env it needs (same as `pnpm seed`): `NEXT_PUBLIC_SANITY_PROJECT_ID` +
 * `SANITY_API_WRITE_TOKEN`. The dataset is forced to `E2E_SANITY_DATASET` (default
 * `e2e`) so a run never touches `production`. Set `E2E_SKIP_SEED=1` to reuse an
 * already-seeded dataset (faster local re-runs).
 */
export default function globalSetup() {
  if (process.env.E2E_SKIP_SEED) return;

  const dataset = process.env.E2E_SANITY_DATASET ?? "e2e";
  if (dataset === "production") {
    throw new Error(
      "Refusing to seed the `production` dataset for e2e — set E2E_SANITY_DATASET.",
    );
  }
  if (!process.env.SANITY_API_WRITE_TOKEN && !existsSync(".env.local")) {
    throw new Error(
      "e2e seed needs SANITY_API_WRITE_TOKEN (or a .env.local). Set it, or pass E2E_SKIP_SEED=1 to reuse a seeded dataset.",
    );
  }

  // Load .env.local locally; in CI the secrets come straight from process.env.
  const args = existsSync(".env.local") ? ["--env-file=.env.local"] : [];
  args.push("scripts/seed-demo.mjs");

  execFileSync("node", args, {
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_SANITY_DATASET: dataset },
  });
}
