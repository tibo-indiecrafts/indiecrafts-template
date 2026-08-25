import { applyD1Migrations, env } from "cloudflare:test";

// Apply db/audit + db/core migrations/*.sql to the ephemeral test D1 before any test runs.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
