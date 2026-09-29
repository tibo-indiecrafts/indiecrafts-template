import { test } from "node:test";
import assert from "node:assert/strict";
import { renameResourcePrefix, wranglerEnvSection } from "./project.mjs";

const swap = (t) => renameResourcePrefix(t, "indiecrafts", "acme");

test("renames quoted resource-name values", () => {
  assert.equal(
    swap('name = "indiecrafts-dev-shared-api"'),
    'name = "acme-dev-shared-api"',
  );
  assert.equal(
    swap('database_name = "indiecrafts-prod-shared-api"'),
    'database_name = "acme-prod-shared-api"',
  );
});

test("renames an Analytics Engine dataset name (the rename-completeness gap)", () => {
  assert.equal(
    swap('dataset = "indiecrafts-prod-shared-api-events"'),
    'dataset = "acme-prod-shared-api-events"',
  );
});

test("renames the BACKUP_BUCKET var (an R2 bucket name carried in [vars])", () => {
  assert.equal(
    swap('BACKUP_BUCKET = "indiecrafts-prod-db-backup"'),
    'BACKUP_BUCKET = "acme-prod-db-backup"',
  );
});

test("rewrites `wrangler … create <prefix>-…` comment examples", () => {
  assert.equal(
    swap("#   wrangler d1 create indiecrafts-dev-shared-api --location weur"),
    "#   wrangler d1 create acme-dev-shared-api --location weur",
  );
  assert.equal(
    swap(
      "# wrangler kv namespace create indiecrafts-dev-shared-api-security-counters",
    ),
    "# wrangler kv namespace create acme-dev-shared-api-security-counters",
  );
});

test("leaves prose comments and non-resource keys untouched", () => {
  // A comment WITHOUT `create` keeps the prefix (documentation, not a command).
  assert.equal(
    swap("# names follow indiecrafts-<env>-<platform>-<slug>"),
    "# names follow indiecrafts-<env>-<platform>-<slug>",
  );
  // `SANITY_DATASET` must NOT match the `dataset` rule.
  assert.equal(
    swap('SANITY_DATASET = "production"'),
    'SANITY_DATASET = "production"',
  );
});

const TOML = [
  'name = "indiecrafts-shared-api"',
  "[env.dev]",
  'name = "indiecrafts-dev-shared-api"',
  "[[env.dev.d1_databases]]",
  'database_id = "real-dev-id"',
  "[env.dev.vars]",
  'WEBSITE_URL = "https://dev.test"',
  "[env.staging]",
  'name = "indiecrafts-staging-shared-api"',
  "[[env.staging.d1_databases]]",
  'database_id = "PASTE_D1_ID_HERE"',
].join("\n");

test("wranglerEnvSection keeps only the [env.<env>] tables", () => {
  const dev = wranglerEnvSection(TOML, "dev");
  assert.match(dev, /real-dev-id/);
  assert.match(dev, /WEBSITE_URL/);
  assert.doesNotMatch(dev, /PASTE_D1_ID_HERE/); // staging's placeholder is not dev's problem
  assert.doesNotMatch(dev, /indiecrafts-shared-api"/); // top-level table is not the env
  assert.match(wranglerEnvSection(TOML, "staging"), /PASTE_D1_ID_HERE/);
  assert.equal(wranglerEnvSection(TOML, "prod"), "");
});
