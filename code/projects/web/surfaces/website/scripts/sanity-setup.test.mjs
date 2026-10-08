import { test } from "node:test";
import assert from "node:assert/strict";
import { apiProjectIds, listLines, plan } from "./sanity-setup.mjs";
import { LOCAL_ORIGIN, siteOrigins } from "./lib/site-origins.mjs";

test("listLines drops colours and blank lines", () => {
  assert.deepEqual(listLines("\x1b[32mproduction\x1b[39m\n\n  tests-e2e \n"), [
    "production",
    "tests-e2e",
  ]);
});

test("plan adds only what is missing", () => {
  const p = plan({
    datasets: ["production"],
    origins: ["http://localhost:3000"],
    wanted: {
      datasets: ["production", "tests-e2e"],
      origins: ["https://acme.com", "http://localhost:3000"],
    },
  });
  assert.deepEqual(p.missingDatasets, ["tests-e2e"]);
  assert.deepEqual(p.missingOrigins, ["https://acme.com"]);
  assert.deepEqual(p.warnings, []);
});

test("plan warns past the free plan's 2 datasets", () => {
  const p = plan({
    datasets: ["production", "staging"],
    origins: [],
    wanted: { datasets: ["production", "tests-e2e"], origins: [] },
  });
  assert.deepEqual(p.missingDatasets, ["tests-e2e"]);
  assert.match(p.warnings[0], /3 datasets; Sanity's free plan allows 2/);
});

test("apiProjectIds reads every env's SANITY_PROJECT_ID", () => {
  const toml =
    '[env.dev.vars]\nSANITY_PROJECT_ID = "abc"\n# SANITY_PROJECT_ID = "no"\n[env.prod.vars]\n  SANITY_PROJECT_ID = "xyz"\n';
  assert.deepEqual(apiProjectIds(toml), ["abc", "xyz"]);
});

test("siteOrigins: prod first, localhost last, origins only, no duplicates", () => {
  const toml = [
    "[env.dev.vars]",
    'NEXT_PUBLIC_SITE_URL = "https://dev.acme.com/en"',
    "[env.prod.vars]",
    'NEXT_PUBLIC_SITE_URL = "https://acme.com"',
    "[env.staging.vars]",
    'NEXT_PUBLIC_SITE_URL = "https://acme.com"',
  ].join("\n");
  assert.deepEqual(siteOrigins(toml), [
    "https://acme.com",
    "https://dev.acme.com",
    LOCAL_ORIGIN,
  ]);
});
