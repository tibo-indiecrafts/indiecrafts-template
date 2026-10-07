import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { firstLoadFiles, LANDING_PAGE } from "./check-bundle-size.mjs";

const SCRIPT = resolve(
  "code/projects/web/surfaces/website/scripts/check-bundle-size.mjs",
);

test("first load = the page's bootstrap files + every layer's entry chunks, once each", () => {
  const files = firstLoadFiles({
    page: LANDING_PAGE,
    buildManifest: {
      rootMainFiles: ["static/chunks/other-route.js"],
      rootMainFilesTree: {
        [LANDING_PAGE]: ["static/chunks/runtime.js", "static/chunks/react.js"],
      },
    },
    clientManifest: {
      entryJSFiles: {
        "[project]/src/app/[locale]/layout": [
          "static/chunks/react.js",
          "static/chunks/clerk.js",
        ],
        "[project]/src/app/[locale]/(home)/page": [
          "static/chunks/home.js",
          "static/css/x.css",
        ],
      },
    },
  });
  assert.deepEqual(files, [
    "static/chunks/runtime.js",
    "static/chunks/react.js",
    "static/chunks/clerk.js",
    "static/chunks/home.js",
  ]);
});

test("falls back to rootMainFiles when the page has no tree entry", () => {
  const files = firstLoadFiles({
    page: LANDING_PAGE,
    buildManifest: { rootMainFiles: ["static/chunks/runtime.js"] },
    clientManifest: {},
  });
  assert.deepEqual(files, ["static/chunks/runtime.js"]);
});

test("--enforce skips when there is no build, and fails when a build can't be read", () => {
  const run = (cwd, args) =>
    spawnSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: "utf8" });
  // No `.next` at all: `turbo --affected` skipped the website — nothing to measure.
  assert.equal(run(tmpdir(), ["--enforce"]).status, 0);
  // A build whose route manifest is missing: the gate must not pass silently.
  const dir = mkdtempSync(join(tmpdir(), "bundle-size-"));
  mkdirSync(join(dir, ".next"));
  writeFileSync(join(dir, ".next", "build-manifest.json"), "{}");
  assert.equal(run(dir, []).status, 0);
  const enforced = run(dir, ["--enforce"]);
  assert.equal(enforced.status, 1);
  assert.match(enforced.stderr, /can't read the production build/);
});
