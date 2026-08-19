import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { APPS, ENVS, deployable, isCloudflare } from "./apps.mjs";

const CLASSES = new Set(["next-cf", "worker-cf", "expo", "electron"]);

test("every app row is well-formed with a known platform class", () => {
  for (const a of APPS) {
    assert.ok(
      a.slug && a.pkg && a.class && typeof a.order === "number",
      `bad row: ${a.slug}`,
    );
    assert.ok(CLASSES.has(a.class), `unknown class for ${a.slug}: ${a.class}`);
  }
});

test("slugs are unique", () => {
  const slugs = APPS.map((a) => a.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("each app row's `dir` exists (no drift / no orphans)", () => {
  for (const a of APPS) {
    assert.ok(
      a.dir && a.platform && a.kind,
      `row ${a.slug} missing dir/platform/kind`,
    );
    assert.ok(
      existsSync(a.dir),
      `registry lists ${a.slug} but ${a.dir} is missing`,
    );
  }
});

test("deployable() defaults to Cloudflare apps, in deploy order", () => {
  const cf = deployable();
  assert.ok(cf.every(isCloudflare), "default set must be Cloudflare-only");
  assert.deepEqual(
    cf.map((a) => a.slug),
    ["api", "cron", "workers", "website", "admin"],
  );
});

test("deployable({ only: 'all' }) includes the native classes", () => {
  const all = deployable({ only: "all" });
  assert.ok(
    all.some((a) => a.class === "expo"),
    "expo missing",
  );
  assert.ok(
    all.some((a) => a.class === "electron"),
    "electron missing",
  );
});

test("ENVS are the three Cloudflare deploy envs", () => {
  assert.deepEqual(ENVS, ["dev", "staging", "prod"]);
});
