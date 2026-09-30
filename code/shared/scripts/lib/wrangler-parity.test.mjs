import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { wranglerEnvSection } from "./project.mjs";

const read = (p) =>
  readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8");
const API = read("../../api/wrangler.toml");
const CRON = read("../../cron/wrangler.toml");
const exportBucket = (section) =>
  section.match(
    /r2_buckets\]\]\s*\nbinding = "EXPORT_BUCKET"\s*\nbucket_name = "([^"]+)"/,
  )?.[1] ?? null;

// The cron's export_cleanup pass deletes what the api's POST /v1/export writes. An env that
// binds the bucket on the api but not on the cron leaves unread GDPR exports forever.
for (const env of ["dev", "staging", "prod"]) {
  test(`${env}: the cron binds the api's EXPORT_BUCKET`, () => {
    const api = exportBucket(wranglerEnvSection(API, env));
    if (api) assert.equal(exportBucket(wranglerEnvSection(CRON, env)), api);
  });
}
