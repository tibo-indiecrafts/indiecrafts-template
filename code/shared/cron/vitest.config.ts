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
  // The cron shares the api's two D1s (see wrangler.toml) — read the api's own
  // db/audit + db/core migrations/*.sql so the test DB has the real schema (erasure_requests,
  // export_requests, security_events, …), same pattern as the api's own vitest.config.ts.
  const migrations = [
    ...(await readD1Migrations("../api/db/audit/migrations")),
    ...(await readD1Migrations("../api/db/core/migrations")),
  ];
  return {
    test: {
      include: ["src/**/*.test.ts"],
      poolOptions: {
        workers: {
          wrangler: { configPath: "./wrangler.toml" },
          miniflare: {
            // wrangler.toml binds DB/CORE_DB/EXPORT_BUCKET per-env only (operator-provisioned);
            // the test pool reads the base config, so create local simulated ones here.
            // DB and CORE_DB share one underlying local D1 (same id) — applying the
            // migrations once via env.DB gives both bindings every table, same as the
            // api's own vitest.config.ts.
            d1Databases: {
              DB: "test-shared-cron-d1",
              CORE_DB: "test-shared-cron-d1",
            },
            r2Buckets: ["EXPORT_BUCKET"],
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
  };
});
