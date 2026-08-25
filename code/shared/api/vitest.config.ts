import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig(async () => {
  // Read every db/audit + db/core migrations/*.sql so tests run against the real schema —
  // both still apply to the single local `DB` binding, since no code queries CORE_DB yet.
  const migrations = [
    ...(await readD1Migrations("./db/audit/migrations")),
    ...(await readD1Migrations("./db/core/migrations")),
  ];
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
            // Same reasoning for R2 — EXPORT_BUCKET is a local simulated bucket.
            r2Buckets: ["EXPORT_BUCKET"],
            bindings: {
              // The bearer the authenticated-route tests send. Safe: the
              // existing no-bearer 401 tests are unaffected.
              APP_API_TOKEN: "test-token",
              // Passed to test-setup.ts to apply migrations.
              TEST_MIGRATIONS: migrations,
            },
          },
        },
      },
    },
  };
});
