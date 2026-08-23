import type { Env } from "./index";

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    // Populated in vitest.config.ts via readD1Migrations().
    TEST_MIGRATIONS: D1Migration[];
    // Env.DB is optional (503-until-bound in prod); the test pool always binds it
    // (d1Databases: ["DB"] in vitest.config.ts), so narrow it here to non-optional.
    DB: D1Database;
  }
}
