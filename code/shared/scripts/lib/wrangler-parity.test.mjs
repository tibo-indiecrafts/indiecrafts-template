import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { wranglerEnvSection } from "./project.mjs";
import { APPS, isCloudflare } from "./apps.mjs";

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

// "Run now" reaches the cron through the api's CRON service binding — never over the
// internet: the cron has no workers.dev URL, and the binding targets the cron's own name.
const workerName = (section) =>
  section.match(/^name\s*=\s*"([^"]+)"/m)?.[1] ?? null;
const cronService = (section) => {
  for (const block of section.split(/^\s*\[/m)) {
    if (!/^\[[^\]]*services\]\]/.test(block)) continue;
    if (block.match(/^\s*binding\s*=\s*"([^"]+)"/m)?.[1] === "CRON")
      return block.match(/^\s*service\s*=\s*"([^"]+)"/m)?.[1] ?? null;
  }
  return null;
};
test("top level: the cron has no public workers.dev or preview URL (a bare `wrangler deploy`)", () => {
  assert.match(CRON.split(/^\[/m)[0], /^workers_dev\s*=\s*false/m);
  assert.match(CRON.split(/^\[/m)[0], /^preview_urls\s*=\s*false/m);
});
for (const env of ["dev", "staging", "prod"]) {
  test(`${env}: the cron has no public workers.dev URL`, () => {
    assert.match(wranglerEnvSection(CRON, env), /^workers_dev\s*=\s*false/m);
    assert.match(wranglerEnvSection(CRON, env), /^preview_urls\s*=\s*false/m);
  });
  test(`${env}: the api's CRON binding targets the cron Worker`, () => {
    assert.equal(
      cronService(wranglerEnvSection(API, env)),
      workerName(wranglerEnvSection(CRON, env)),
    );
  });
}

/** What a wrangler.toml is missing from full Cloudflare observability (logs · traces · issues).
 *  Each must be on in the top-level block; an `[env.<name>.observability…]` table REPLACES that
 *  block for the env (Wrangler does not merge it), so any env-level table is a gap too. */
export function observabilityGaps(toml) {
  const table = (name) =>
    toml.match(
      new RegExp(`^\\[${name.replace(".", "\\.")}\\]\\s*\\n([^[]*)`, "m"),
    )?.[1] ?? "";
  const on = (name) => /^\s*enabled\s*=\s*true\b/m.test(table(name));
  const gaps = [
    "observability",
    "observability.logs",
    "observability.traces",
    "observability.issues",
  ].filter((name) => !on(name));
  for (const [header] of toml.matchAll(
    /^\[env\.[^.\]]+\.observability[^\]]*\]/gm,
  ))
    gaps.push(header);
  return gaps;
}

test("observabilityGaps flags a missing, disabled or env-overridden part", () => {
  const full =
    "[observability]\nenabled = true\n[observability.logs]\nenabled = true\n" +
    "[observability.traces]\nenabled = true\n[observability.issues]\nenabled = true\n";
  assert.deepEqual(observabilityGaps(full), []);
  assert.deepEqual(
    observabilityGaps(full.replace(/\[observability\.traces\][^[]*/, "")),
    ["observability.traces"],
  );
  assert.deepEqual(
    observabilityGaps(
      full.replace(
        "[observability.issues]\nenabled = true",
        "[observability.issues]\nenabled = false",
      ),
    ),
    ["observability.issues"],
  );
  assert.deepEqual(
    observabilityGaps(`${full}[env.prod.observability.logs]\nenabled = true\n`),
    ["[env.prod.observability.logs]"],
  );
});

test("every Cloudflare app has logs, traces and issues on in every env", () => {
  for (const app of APPS.filter(isCloudflare)) {
    const toml = read(`../../../../${app.dir}/wrangler.toml`);
    assert.deepEqual(observabilityGaps(toml), [], `${app.dir}/wrangler.toml`);
  }
});

// A workers.dev env is not in the domain registry, so without its own NEXT_PUBLIC_SITE_URL the
// build bakes the `example.com` placeholder — every link in a dev email (newsletter confirm,
// lead-magnet download, comment moderation) then points nowhere.
test("website dev: the build gets a real origin (email links), not the placeholder", async () => {
  const { envVars } = await import("./deploy-shared.mjs");
  const { originFor } = await import("./domains.mjs");
  const website = read("../../../projects/web/surfaces/website/wrangler.toml");
  const url =
    originFor("website", "dev") || envVars(website, "dev").NEXT_PUBLIC_SITE_URL;
  assert.match(url ?? "", /^https:\/\/[^/]+$/);
  assert.doesNotMatch(url, /example\.com/);
});
