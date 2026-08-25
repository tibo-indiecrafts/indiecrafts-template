import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig(async () => {
  // Read every db/audit + db/core migrations/*.sql so tests run against the real schema.
  // DB and CORE_DB share one underlying local D1 (same id below) — applying the migrations
  // once via env.DB gives both bindings every table.
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
            // wrangler.toml binds DB/CORE_DB per-env only; the test pool reads the base
            // config, so create the local ephemeral D1 here. Both bindings share one id —
            // production splits core tables onto their own D1, but a single local D1 with
            // every table is enough to exercise the binding split in tests.
            d1Databases: {
              DB: "test-shared-api-d1",
              CORE_DB: "test-shared-api-d1",
            },
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
