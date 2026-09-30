import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { wranglerEnvSection } from "./project.mjs";

const read = (p) =>
  readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8");
const API = read("../../api/wrangler.toml");
const CRON = read("../../cron/wrangler.toml");

/** The `bucket_name` of the `EXPORT_BUCKET` R2 binding in one env section, or null. Reads each
 *  `[[…r2_buckets]]` block on its own: keys in any order, any spacing, trailing comments. */
export function exportBucket(section) {
  for (const block of section.split(/^\s*\[/m)) {
    if (!/^\[[^\]]*r2_buckets\]\]/.test(block)) continue;
    const binding = block.match(/^\s*binding\s*=\s*"([^"]+)"/m)?.[1];
    const bucket = block.match(/^\s*bucket_name\s*=\s*"([^"]+)"/m)?.[1];
    if (binding === "EXPORT_BUCKET" && bucket) return bucket;
  }
  return null;
}

const block = (lines) => `[env.prod]\nname = "x"\n\n${lines.join("\n")}\n`;

test("exportBucket reads the binding however the block is written", () => {
  for (const lines of [
    [
      "[[env.prod.r2_buckets]]",
      'binding = "EXPORT_BUCKET"',
      'bucket_name = "b"',
    ],
    [
      "[[env.prod.r2_buckets]]",
      'binding = "EXPORT_BUCKET"            # env.EXPORT_BUCKET',
      'bucket_name = "b"',
    ],
    [
      "[[env.prod.r2_buckets]]",
      'bucket_name = "b"',
      'binding = "EXPORT_BUCKET"',
    ],
    [
      "[[env.prod.r2_buckets]]",
      'binding     = "EXPORT_BUCKET"',
      'bucket_name = "b"',
    ],
    [
      "[[env.prod.r2_buckets]]",
      'binding = "EXPORT_BUCKET"',
      "# the api export bundles",
      'bucket_name = "b"',
    ],
  ])
    assert.equal(exportBucket(block(lines)), "b", lines.join(" | "));
});

test("exportBucket ignores another R2 binding and a commented-out block", () => {
  assert.equal(
    exportBucket(
      block([
        "[[env.prod.r2_buckets]]",
        'binding = "OTHER"',
        'bucket_name = "o"',
      ]),
    ),
    null,
  );
  assert.equal(
    exportBucket(
      block([
        "# [[env.prod.r2_buckets]]",
        '# binding = "EXPORT_BUCKET"',
        '# bucket_name = "b"',
      ]),
    ),
    null,
  );
});

// Guard against a parser that silently stops matching: the api binds the bucket in dev today.
test("the api's dev section yields a bucket (parser still matches the real file)", () => {
  assert.ok(exportBucket(wranglerEnvSection(API, "dev")));
});

// The cron's export_cleanup pass deletes what the api's POST /v1/export writes. An env that
// binds the bucket on the api but not on the cron leaves unread GDPR exports forever.
for (const env of ["dev", "staging", "prod"]) {
  test(`${env}: the cron binds the api's EXPORT_BUCKET`, () => {
    const api = exportBucket(wranglerEnvSection(API, env));
    if (api) assert.equal(exportBucket(wranglerEnvSection(CRON, env)), api);
  });
}
