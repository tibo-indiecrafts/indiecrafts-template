import { test } from "node:test";
import assert from "node:assert/strict";
import { renameResourcePrefix } from "./project.mjs";

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
