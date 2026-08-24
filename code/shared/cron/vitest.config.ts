import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";

// Runs the tests INSIDE the Workers runtime (workerd), driven by the real
// wrangler.toml — so `cloudflare:test` `SELF` / `env` exercise the deployed worker
// and real bindings (KV/D1) once you add them. Pinned to the vitest-3-compatible
// pool (0.8.x, `defineWorkersConfig`); the `cloudflareTest()` plugin form arrives
// with the repo's next Vitest (4) bump. See code/docs/apps/workers/.
export default defineWorkersConfig(async () => {
  // The cron shares the api's D1 (see wrangler.toml) — read the api's own
  // db/d1/migrations/*.sql so the test DB has the real schema (erasure_requests,
  // export_requests, security_events, …), same pattern as the api's own vitest.config.ts.
  const migrations = await readD1Migrations("../api/db/d1/migrations");
  return {
    test: {
      include: ["src/**/*.test.ts"],
      poolOptions: {
        workers: {
          wrangler: { configPath: "./wrangler.toml" },
          miniflare: {
            // wrangler.toml binds DB/EXPORT_BUCKET per-env only (operator-provisioned);
            // the test pool reads the base config, so create local simulated ones here.
            d1Databases: ["DB"],
            r2Buckets: ["EXPORT_BUCKET"],
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
  };
});
