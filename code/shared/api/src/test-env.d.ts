/// <reference types="@cloudflare/vitest-pool-workers" />
import type { Env } from "./index";

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    // Populated in vitest.config.ts via readD1Migrations().
    TEST_MIGRATIONS: D1Migration[];
    // Env.AUDIT_DB/MAIN_DB are optional (503-until-bound in prod); the test pool always binds
    // both (d1Databases in vitest.config.ts), so narrow them here to non-optional.
    AUDIT_DB: D1Database;
    MAIN_DB: D1Database;
  }
}
