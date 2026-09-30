import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { LOCAL_D1, migrateLocalArgs, STATE_DIR } from "./migrate-local.mjs";

const REPO = fileURLToPath(new URL("../../../..", import.meta.url)).replace(
  /\/$/,
  "",
);

// `pnpm dev` runs the api, cron and workers on ONE local state dir, so the cron sees the api's
// data. db:migrate:local must write to that same dir.
test("the local state dir is the repo's .wrangler/state (shared by every dev worker)", () => {
  assert.equal(STATE_DIR, `${REPO}/.wrangler/state`);
});

test("applies each D1 by binding, locally, into the shared state dir", () => {
  assert.deepEqual(migrateLocalArgs("AUDIT_DB"), [
    "d1",
    "migrations",
    "apply",
    "AUDIT_DB",
    "--local",
    "--env",
    "dev",
    "--persist-to",
    `${REPO}/.wrangler/state`,
  ]);
});

test("covers every D1 in the registry (audit + main)", () => {
  assert.deepEqual(LOCAL_D1.map((d) => d.binding).sort(), [
    "AUDIT_DB",
    "MAIN_DB",
  ]);
});
