/**
 * Seed the throwaway e2e Sanity dataset and fetch a Clerk testing token before journeys run.
 *
 * @see docs/reference/projects/web/website/e2e/global-setup.md
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { clerkSetup } from "@clerk/testing/playwright";

/**
 * Seed the throwaway `e2e` Sanity dataset before the app journeys run — reuses
 * the existing `scripts/seed-demo.mjs` (no bespoke fixture framework). Idempotent:
 * the seeder upserts, so re-running is safe. Then, IF a Clerk test instance is wired
 * (`CLERK_SECRET_KEY`), fetch a Clerk Testing Token so the auth journey can bypass
 * bot detection — a no-op otherwise, so a run without Clerk keys is unaffected.
 *
 * Env it needs (same as `pnpm seed`): `NEXT_PUBLIC_SANITY_PROJECT_ID` +
 * `SANITY_API_WRITE_TOKEN`. The dataset is forced to `E2E_SANITY_DATASET` (default
 * `e2e`) so a run never touches `production`. Set `E2E_SKIP_SEED=1` to reuse an
 * already-seeded dataset (faster local re-runs).
 */
export default async function globalSetup() {
  // Auth journey (self-skips when unset): fetch a Clerk Testing Token for the run.
  if (process.env.CLERK_SECRET_KEY) await clerkSetup();

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

  try {
    execFileSync("node", args, {
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_SANITY_DATASET: dataset },
    });
  } catch (error) {
    // The seeder IMPORTS into an existing dataset — it can't create one, and a content
    // `SANITY_API_WRITE_TOKEN` lacks the `datasets/create` grant. So the `e2e` dataset is a
    // ONE-TIME manual setup (by someone with dataset-admin rights); until it exists the whole
    // app-journey suite can't run. Turn the seeder's raw "Dataset not found" into a next step.
    throw new Error(
      `e2e seed failed — the \`${dataset}\` Sanity dataset must exist first. Create it ONCE ` +
        `(needs dataset-admin rights — a content write token can't):\n` +
        `  pnpm --filter @indiecrafts/web-surfaces-website exec sanity dataset create ${dataset} --visibility private\n` +
        `Then re-run \`pnpm e2e\`. (Or set E2E_SKIP_SEED=1 to reuse an already-seeded dataset.) ` +
        `Original error: ${(error as Error)?.message ?? String(error)}`,
    );
  }
}
