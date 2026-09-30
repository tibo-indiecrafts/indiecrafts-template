import assert from "node:assert/strict";
import { test } from "node:test";
import { preflight } from "./tfvars-preflight.mjs";

const ID = "0123456789abcdef0123456789abcdef";

test("a filled workers.dev env passes (no zone needed)", () => {
  assert.deepEqual(
    preflight(
      `account_id = "${ID}"\nattach_domain = false\nzone_id = ""\ndomain = ""`,
    ),
    [],
  );
});

test("a blank account_id is reported", () => {
  assert.match(
    preflight(`account_id = ""\nattach_domain = false`).join(),
    /account_id/,
  );
});

test("a custom domain needs a zone_id and a real domain", () => {
  const out = preflight(
    `account_id = "${ID}"\nattach_domain = true\nzone_id = ""\ndomain = "app.example.com"`,
  ).join("\n");
  assert.match(out, /zone_id/);
  assert.match(out, /example\.com.*placeholder/);
});

test("a real domain + zone passes", () => {
  assert.deepEqual(
    preflight(
      `account_id = "${ID}"\nattach_domain = true\nzone_id = "${ID}"\ndomain = "updates.indiecrafts.dev"`,
    ),
    [],
  );
});

test("a stack with no attach_domain (account-level) needs only account_id", () => {
  assert.deepEqual(preflight(`env = "dev"\naccount_id = "${ID}"`), []);
});
