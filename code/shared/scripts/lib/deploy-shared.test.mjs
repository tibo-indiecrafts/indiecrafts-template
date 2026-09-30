import { test } from "node:test";
import assert from "node:assert/strict";
import { gateSkipped, confirmSkipped, buildVarArgs } from "./deploy-shared.mjs";

// The verify gate is tiered: dev + CI skip; staging/prod run it; --skip-gate opts out.
test("gateSkipped — dev + CI skip, staging/prod gate", () => {
  assert.equal(gateSkipped("dev", { ci: "" }), true); // fast sandbox
  assert.equal(gateSkipped("staging", { ci: "" }), false); // gated
  assert.equal(gateSkipped("prod", { ci: "" }), false); // gated
  assert.equal(gateSkipped("prod", { ci: "true" }), true); // CI already gated it
  assert.equal(gateSkipped("prod", { skipGate: true, ci: "" }), true); // hotfix escape
});

// Prod confirm skips for non-prod, in CI, or with an explicit ack; a bare --yes (delegate)
// still skips, but the top-level deploy passes yesProd only.
test("confirmSkipped — only an un-acked, non-CI prod deploy prompts", () => {
  assert.equal(confirmSkipped("dev", { ci: "" }), true);
  assert.equal(confirmSkipped("staging", { ci: "" }), true);
  assert.equal(confirmSkipped("prod", { ci: "" }), false); // must prompt
  assert.equal(confirmSkipped("prod", { ci: "true" }), true);
  assert.equal(confirmSkipped("prod", { yesProd: true, ci: "" }), true);
  assert.equal(confirmSkipped("prod", { yes: true, ci: "" }), true); // delegate path
});

// The api's /health reports the build it runs: every worker deploy stamps its version + commit.
test("buildVarArgs stamps the version and commit as wrangler --var pairs", () => {
  assert.deepEqual(buildVarArgs("1.2.0", "abc123"), [
    "--var",
    "BUILD_VERSION:1.2.0",
    "--var",
    "BUILD_COMMIT:abc123",
  ]);
});
