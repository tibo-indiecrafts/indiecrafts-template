import { test } from "node:test";
import assert from "node:assert/strict";
import {
  gateSkipped,
  confirmSkipped,
  buildVarArgs,
  envVars,
  buildEnv,
  loopbackPublicVars,
  missingEnv,
} from "./deploy-shared.mjs";

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

const TOML = `
[vars]
API_URL = "http://top-level"

[env.dev.vars]
# a comment
API_URL = "https://dev-api.example.workers.dev"
NEXT_PUBLIC_ENVIRONMENT = "development"

[[env.dev.r2_buckets]]
binding = "X"

[env.prod.vars]
API_URL = "https://api.example.com"
`;

test("envVars — reads only that env's [env.<env>.vars] strings", () => {
  assert.deepEqual(envVars(TOML, "dev"), {
    API_URL: "https://dev-api.example.workers.dev",
    NEXT_PUBLIC_ENVIRONMENT: "development",
  });
  assert.deepEqual(envVars(TOML, "prod"), {
    API_URL: "https://api.example.com",
  });
  assert.deepEqual(envVars(TOML, "staging"), {});
});

// Next.js loads env files under process.env: .env.production.local > .env.local >
// .env.production > .env. The build sees the first value found.
test("buildEnv — the value the Next build will see, by Next's precedence", () => {
  const files = {
    ".env": "NEXT_PUBLIC_A=env\nNEXT_PUBLIC_B=env",
    ".env.local": "NEXT_PUBLIC_A=local\nNEXT_PUBLIC_C=local",
  };
  assert.deepEqual(buildEnv(files, { NEXT_PUBLIC_C: "process" }), {
    NEXT_PUBLIC_A: "local",
    NEXT_PUBLIC_B: "env",
    NEXT_PUBLIC_C: "process",
  });
});

test("loopbackPublicVars — flags a public URL that points at this machine", () => {
  assert.deepEqual(
    loopbackPublicVars({
      NEXT_PUBLIC_API_URL: "http://localhost:8787",
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
      NEXT_PUBLIC_CDN: "http://[::1]/x",
      NEXT_PUBLIC_OK: "https://api.example.com",
      API_URL: "http://localhost:8787", // server-only: not baked into the bundle
      NEXT_PUBLIC_HOSTISH: "https://localhost-tools.example.com",
    }),
    ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_CDN"],
  );
});

test("missingEnv — a required key unset or blank is missing", () => {
  const keys = ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"];
  assert.deepEqual(missingEnv(keys, {}), keys);
  assert.deepEqual(
    missingEnv(keys, { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: " " }),
    keys,
  );
  assert.deepEqual(
    missingEnv(keys, { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_x" }),
    [],
  );
  assert.deepEqual(missingEnv(undefined, {}), []);
});
