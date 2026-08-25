import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DATABASES, KINDS, ALTITUDES, byKind } from "./databases.mjs";
import { APPS } from "./apps.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

test("every db row is well-formed with a known kind + altitude", () => {
  for (const d of DATABASES) {
    assert.ok(d.name && d.owner && d.dir, `bad row: ${d.name}`);
    assert.ok(KINDS.includes(d.kind), `unknown kind for ${d.name}: ${d.kind}`);
    assert.ok(ALTITUDES.includes(d.altitude), `unknown altitude for ${d.name}`);
  }
});

test("db names are unique", () => {
  const names = DATABASES.map((d) => d.name);
  assert.equal(new Set(names).size, names.length);
});

test("the core D1 is registered (identity/rights/settings, split from the audit firehose)", () => {
  const core = DATABASES.find((d) => d.name === "core");
  assert.ok(core, "no `core` row in the registry");
  assert.equal(core.kind, "d1");
  assert.equal(core.owner, "api");
  assert.equal(core.binding, "CORE_DB");
});

test("audit's dir points at the reorganized migrations dir", () => {
  const audit = DATABASES.find((d) => d.name === "audit");
  assert.equal(audit.dir, "code/shared/api/db/audit");
});

test("each db row's `dir` exists (no drift / no orphans)", () => {
  for (const d of DATABASES) {
    assert.ok(
      existsSync(d.dir),
      `registry lists ${d.name} but ${d.dir} is missing`,
    );
  }
});

// The migrate contract (the bug this guards): a d1 row MUST carry a `binding`, and the
// owner's wrangler.toml MUST declare it — the runner passes the binding to wrangler so it
// resolves the RIGHT per-env database. Without a binding, migrate fell back to grepping
// the first `database_name` in the file — always the wrong DB and the wrong env.
test("every d1 db has a binding that its owner's wrangler.toml declares", () => {
  for (const d of byKind("d1")) {
    assert.ok(d.binding, `d1 db "${d.name}" needs a "binding" (e.g. "DB")`);
    const owner = APPS.find((a) => a.slug === d.owner);
    assert.ok(owner, `d1 db "${d.name}" owner "${d.owner}" not in the app registry`);
    const toml = resolve(REPO_ROOT, owner.dir, "wrangler.toml");
    assert.ok(existsSync(toml), `${d.owner}: wrangler.toml missing`);
    assert.match(
      readFileSync(toml, "utf8"),
      new RegExp(`binding\\s*=\\s*"${d.binding}"`),
      `${d.owner}/wrangler.toml must declare binding "${d.binding}" for db "${d.name}"`,
    );
  }
});
