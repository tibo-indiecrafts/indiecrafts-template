import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DOMAINS,
  ENVS,
  domainFor,
  originFor,
  hostsFor,
  isConfigured,
} from "./domains.mjs";
import { APPS } from "./apps.mjs";

const SLUGS = new Set(APPS.map((a) => a.slug));

test("every domain row targets a real app with valid envs", () => {
  for (const d of DOMAINS) {
    assert.ok(SLUGS.has(d.app), `domain row for unknown app: ${d.app}`);
    for (const [env, e] of Object.entries(d.envs ?? {})) {
      assert.ok(ENVS.includes(env), `unknown env "${env}" for ${d.app}`);
      if (e) {
        assert.ok(
          typeof e.host === "string",
          `${d.app}/${env} host must be a string`,
        );
        assert.ok(
          !e.aliases || Array.isArray(e.aliases),
          `${d.app}/${env} aliases must be an array`,
        );
      }
    }
  }
});

test("one row per app (no duplicates)", () => {
  const apps = DOMAINS.map((d) => d.app);
  assert.equal(new Set(apps).size, apps.length);
});

test("helpers gate on the placeholder host + no-custom-domain", () => {
  const d = domainFor("website", "prod");
  assert.ok(d, "website prod row exists");
  assert.equal(
    isConfigured(d),
    false,
    "example.com is the placeholder → not configured",
  );
  assert.equal(originFor("website", "prod"), "", "placeholder → no origin");
  assert.equal(
    originFor("website", "dev"),
    "",
    "no custom domain (null) → no origin",
  );
  assert.deepEqual(hostsFor("website", "prod"), [
    "example.com",
    "www.example.com",
  ]);
  assert.deepEqual(hostsFor("website", "dev"), [], "null env → no hosts");
});
