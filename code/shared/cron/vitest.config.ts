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
  // Read every ../api/db/d1/migrations/*.sql so tests run against the real schema.
  const migrations = await readD1Migrations("../api/db/d1/migrations");
  return {
    test: {
      include: ["src/**/*.test.ts"],
      setupFiles: ["./src/test-setup.ts"],
      poolOptions: {
        workers: {
          wrangler: { configPath: "./wrangler.toml" },
          miniflare: {
            // wrangler.toml binds DB per-env only; the test pool reads the base
            // config, so create the local ephemeral D1 here.
            d1Databases: ["DB"],
            bindings: {
              // Passed to test-setup.ts to apply migrations.
              TEST_MIGRATIONS: migrations,
            },
          },
        },
      },
    },
  };
});
