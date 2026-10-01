import assert from "node:assert/strict";
import { test } from "node:test";
import {
  declaredKeys,
  collectSecrets,
  secretsFileFor,
  registryFiles,
  wranglerVarKeys,
} from "./secrets.mjs";

test("declaredKeys reads keys incl. commented; skips NEXT_PUBLIC_", () => {
  const example = [
    '# APP_API_TOKEN=""',
    "IP_HASH_SALT=",
    "NEXT_PUBLIC_API_URL=",
    "# a prose comment",
    '# PII_ENCRYPTION_KEY=""',
  ].join("\n");
  const k = declaredKeys(example);
  assert.ok(k.has("APP_API_TOKEN"));
  assert.ok(k.has("IP_HASH_SALT"));
  assert.ok(k.has("PII_ENCRYPTION_KEY"));
  assert.ok(!k.has("NEXT_PUBLIC_API_URL"));
});

test("collectSecrets: the file wins, then the env fills declared keys", () => {
  const example = [
    '# APP_API_TOKEN=""',
    '# IP_HASH_SALT=""',
    '# PII_ENCRYPTION_KEY=""',
  ].join("\n");
  const devVars = "APP_API_TOKEN=file-token\n";
  const env = {
    IP_HASH_SALT: "ci-salt",
    PII_ENCRYPTION_KEY: "ci-pii",
    APP_API_TOKEN: "ci-should-lose", // the file value wins
    RANDOM_CI_VAR: "ignored", // undeclared → never synced
  };
  const s = collectSecrets(devVars, example, env);
  assert.equal(s.APP_API_TOKEN, "file-token");
  assert.equal(s.IP_HASH_SALT, "ci-salt");
  assert.equal(s.PII_ENCRYPTION_KEY, "ci-pii");
  assert.equal(s.RANDOM_CI_VAR, undefined);
});

test("collectSecrets skips empty, placeholder, and NEXT_PUBLIC_ values", () => {
  const example = [
    '# IP_HASH_SALT=""',
    '# PII_ENCRYPTION_KEY=""',
    '# GDPR_FINGERPRINT_SALT=""',
  ].join("\n");
  const env = { IP_HASH_SALT: "", PII_ENCRYPTION_KEY: "your_key_here" };
  const devVars =
    "NEXT_PUBLIC_API_URL=https://x\nGDPR_FINGERPRINT_SALT=real-salt";
  const s = collectSecrets(devVars, example, env);
  assert.equal(s.IP_HASH_SALT, undefined); // empty env value
  assert.equal(s.PII_ENCRYPTION_KEY, undefined); // placeholder
  assert.equal(s.NEXT_PUBLIC_API_URL, undefined); // public build var
  assert.equal(s.GDPR_FINGERPRINT_SALT, "real-salt");
});

test("collectSecrets never syncs an undeclared local key (a tool key, a local-only URL)", () => {
  const example = '# APP_API_TOKEN=""';
  const devVars =
    "APP_API_TOKEN=t\nTAILARK_API_KEY=tool\nAGENT_URL=http://localhost:9";
  assert.deepEqual(collectSecrets(devVars, example, {}), {
    APP_API_TOKEN: "t",
  });
});

test("collectSecrets works from the env alone (no local file — the CI case)", () => {
  const example = '# IP_HASH_SALT=""\n# PII_ENCRYPTION_KEY=""';
  const s = collectSecrets("", example, {
    IP_HASH_SALT: "ci-salt",
    PII_ENCRYPTION_KEY: "ci-pii",
  });
  assert.deepEqual(s, {
    IP_HASH_SALT: "ci-salt",
    PII_ENCRYPTION_KEY: "ci-pii",
  });
});

test("secretsFileFor: dev reads .dev.vars; staging/prod never fall back to the dev file", () => {
  const has =
    (...files) =>
    (f) =>
      files.includes(f);
  assert.equal(secretsFileFor("dev", has(".dev.vars")), ".dev.vars");
  assert.equal(secretsFileFor("dev", has(".env.local")), ".env.local");
  assert.equal(secretsFileFor("prod", has(".dev.vars")), null);
  assert.equal(
    secretsFileFor("prod", has(".dev.vars", ".dev.vars.prod")),
    ".dev.vars.prod",
  );
  assert.equal(
    secretsFileFor("staging", has(".dev.vars.staging")),
    ".dev.vars.staging",
  );
});

test("registryFiles: a Next app's .env.example declares its secrets too (CI path)", () => {
  const has =
    (...files) =>
    (f) =>
      files.includes(f);
  assert.deepEqual(registryFiles(has(".dev.vars.example")), [
    ".dev.vars.example",
  ]);
  assert.deepEqual(registryFiles(has(".env.example")), [".env.example"]);
  assert.deepEqual(registryFiles(has(".dev.vars.example", ".env.example")), [
    ".dev.vars.example",
    ".env.example",
  ]);
  assert.deepEqual(registryFiles(has()), []);
});

test("wranglerVarKeys: the keys a wrangler env sets as plain vars (never synced as secrets)", () => {
  const toml = [
    "[vars]",
    'TOP = "x"',
    "[env.dev]",
    'name = "w"',
    "[env.dev.vars]",
    "# a comment",
    'API_URL = "https://api.dev"',
    'ADMIN_URL = "https://admin.dev"',
    "[[env.dev.r2_buckets]]",
    'binding = "B"',
    "[env.staging.vars]",
    'API_URL = "https://api.staging"',
  ].join("\n");
  assert.deepEqual([...wranglerVarKeys(toml, "dev")], ["API_URL", "ADMIN_URL"]);
  assert.deepEqual([...wranglerVarKeys(toml, "staging")], ["API_URL"]);
  assert.deepEqual([...wranglerVarKeys(toml, "prod")], []);
});
