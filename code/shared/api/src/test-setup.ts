/**
 * Applies the audit and main D1 migrations to the ephemeral test database before the suite runs.
 *
 * @see docs/reference/shared/api/src/test-setup.md
 */
import { applyD1Migrations, env } from "cloudflare:test";

// Apply db/audit + db/main migrations/*.sql to the ephemeral test D1 before any test runs.
await applyD1Migrations(env.AUDIT_DB, env.TEST_MIGRATIONS);
