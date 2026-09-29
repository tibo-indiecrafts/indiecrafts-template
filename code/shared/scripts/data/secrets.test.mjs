import assert from "node:assert/strict";
import { test } from "node:test";
import { declaredKeys, collectSecrets } from "./secrets.mjs";

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
  const example = ['# IP_HASH_SALT=""', '# PII_ENCRYPTION_KEY=""'].join("\n");
  const env = { IP_HASH_SALT: "", PII_ENCRYPTION_KEY: "your_key_here" };
  // A file key not in the example still syncs (backward compatible); a public var never does.
  const devVars =
    "NEXT_PUBLIC_API_URL=https://x\nGDPR_FINGERPRINT_SALT=real-salt";
  const s = collectSecrets(devVars, example, env);
  assert.equal(s.IP_HASH_SALT, undefined); // empty env value
  assert.equal(s.PII_ENCRYPTION_KEY, undefined); // placeholder
  assert.equal(s.NEXT_PUBLIC_API_URL, undefined); // public build var
  assert.equal(s.GDPR_FINGERPRINT_SALT, "real-salt");
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
