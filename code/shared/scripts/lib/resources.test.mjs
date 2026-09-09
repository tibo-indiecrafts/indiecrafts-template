import assert from "node:assert/strict";
import { test } from "node:test";
import { instanceResources } from "./resources.mjs";
import { deployable, resourceName } from "./apps.mjs";

// The manifest drives teardown — it DELETES exactly what this returns. A resource
// missing here is left orphaned on the account; a wrong name deletes nothing (or the
// wrong thing). So pin the shape: derived from the registries, never hand-listed.
test("instanceResources covers every deployable + the api's owned resources", () => {
  const r = instanceResources("dev", "acme");

  // Every deployable app is a Worker (next-cf + storybook all ship as Workers).
  const wanted = deployable().map((a) => resourceName(a.slug, "dev", "acme"));
  assert.deepEqual(r.workers, wanted);

  // The api owns both D1s — the audit DB and the split-out main DB (the one most
  // likely to be forgotten and left behind).
  assert.deepEqual(r.d1, ["acme-dev-db-audit", "acme-dev-db-main"]);
  assert.deepEqual(r.kv, ["acme-dev-shared-api-security-counters"]);

  // R2: the shared backup bucket + api export + one ISR bucket per next-cf app + hybrid releases.
  assert.ok(r.r2.includes("acme-dev-db-backup"));
  assert.ok(r.r2.includes("acme-dev-shared-api-export"));
  assert.ok(r.r2.includes("acme-dev-web-surfaces-website-isr"));
  assert.ok(r.r2.includes("acme-dev-hybrid-surfaces-main-releases"));

  // Prefix swaps cleanly (the "anonymised" property — a client rename only changes <prefix>).
  for (const name of [...r.workers, ...r.d1, ...r.kv, ...r.r2])
    assert.match(name, /^acme-dev-/);
});
