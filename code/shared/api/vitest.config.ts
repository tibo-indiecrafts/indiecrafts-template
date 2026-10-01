import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig(async () => {
  // Read every db/audit + db/main migrations/*.sql so tests run against the real schema.
  // DB and MAIN_DB share one underlying local D1 (same id below) — applying the migrations
  // once via env.AUDIT_DB gives both bindings every table.
  const migrations = [
    ...(await readD1Migrations("./db/audit/migrations")),
    ...(await readD1Migrations("./db/main/migrations")),
  ];
  return {
    test: {
      include: ["src/**/*.test.ts"],
      setupFiles: ["./src/test-setup.ts"],
      poolOptions: {
        workers: {
          wrangler: { configPath: "./wrangler.toml" },
          miniflare: {
            // wrangler.toml binds DB/MAIN_DB per-env only; the test pool reads the base
            // config, so create the local ephemeral D1 here. Both bindings share one id —
            // production splits core tables onto their own D1, but a single local D1 with
            // every table is enough to exercise the binding split in tests.
            d1Databases: {
              AUDIT_DB: "test-shared-api-d1",
              MAIN_DB: "test-shared-api-d1",
            },
            // Same reasoning for R2 — EXPORT_BUCKET is a local simulated bucket.
            r2Buckets: ["EXPORT_BUCKET"],
            bindings: {
              // The bearer the authenticated-route tests send. Safe: the
              // existing no-bearer 401 tests are unaffected.
              APP_API_TOKEN: "test-token",
              // Keep the test env hermetic: pin the Clerk webhook secret empty so the
              // "fails closed with no secret → 503" test holds regardless of a
              // developer's real `.dev.vars` (which the pool loads and would otherwise
              // flip 503 → 401). An explicit binding overrides `.dev.vars`.
              CLERK_WEBHOOK_SECRET: "",
              // Same for outbound keys: a real `.dev.vars` key made tests call Resend /
              // Sanity for real (slow → 5 s timeouts, and real side effects). A test that
              // needs one passes its own env.
              RESEND_API_KEY: "",
              SANITY_API_WRITE_TOKEN: "",
              // Passed to test-setup.ts to apply migrations.
              TEST_MIGRATIONS: migrations,
            },
          },
        },
      },
    },
  };
});
