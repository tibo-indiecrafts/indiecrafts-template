#!/usr/bin/env node
// Terraform gate — every Cloudflare stack in the infra registry parses, validates with no
// warning, is `terraform fmt`-clean, and PLANS for each env's tfvars against a mocked
// provider. Creds-free: `init -backend=false` + `terraform test` with `mock_provider`, so no
// Cloudflare token and no state. `plan`/`apply` against the real account stay manual.
//
//   node code/shared/scripts/checks/infra.mjs   # exit 1 on any failure
//
// Wired as `pnpm check:infra` (in `pnpm verify` + the CI `infra` job). Without `terraform`
// on PATH it skips locally and FAILS in CI. Each stack is checked in a temp copy (with its
// committed `.terraform.lock.hcl`), so no `.terraform/` lands in the repo. The tfvars ship `account_id`/`zone_id`
// blank (per-client values), so the plan passes format-valid dummy ids.

import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { INFRA } from "../lib/infra-registry.mjs";

const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url));
const DUMMY_ID = "0123456789abcdef0123456789abcdef"; // 32-hex, the shape Cloudflare ids take
const MOCK_PLAN =
  'mock_provider "cloudflare" {}\n\nrun "plan" {\n  command = plan\n}\n';

const tf = (args, cwd) =>
  execFileSync("terraform", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

try {
  tf(["version"]);
} catch {
  if (process.env.CI) {
    console.error("check:infra — terraform is not installed (required in CI).");
    process.exit(1);
  }
  console.log(
    "check:infra — skipped: terraform is not on PATH (install it to run this gate).",
  );
  process.exit(0);
}

const work = mkdtempSync(join(tmpdir(), "check-infra-"));
const env = {
  ...process.env,
  // Reuse downloaded providers across runs; each stack still gets a fresh working copy.
  TF_PLUGIN_CACHE_DIR:
    process.env.TF_PLUGIN_CACHE_DIR || join(tmpdir(), "check-infra-plugins"),
  TF_IN_AUTOMATION: "1",
};
mkdirSync(env.TF_PLUGIN_CACHE_DIR, { recursive: true });
const exec = promisify(execFile);
const run = (args, cwd) =>
  exec("terraform", args, { cwd, env, maxBuffer: 16 * 1024 * 1024 });
const errOf = (e) => `${e.stdout ?? ""}${e.stderr ?? ""}`.trim();

// One stack: returns its failures. Stacks run in parallel (independent temp copies).
async function checkStack(row) {
  const fail = [];
  const src = resolve(REPO_ROOT, row.dir);
  const dst = join(work, row.name);
  try {
    await run(["fmt", "-check", "-recursive", "-no-color", src]);
  } catch (e) {
    fail.push(
      `${row.name}: not terraform-fmt clean — run \`terraform fmt -recursive ${row.dir}\`\n${errOf(e)}`,
    );
  }

  // The committed lock pins the provider version + its hashes (darwin + linux) — required.
  const LOCK = ".terraform.lock.hcl";
  if (!existsSync(join(src, LOCK)))
    fail.push(
      `${row.name}: no ${LOCK} — run \`terraform -chdir=${row.dir} providers lock -platform=darwin_arm64 -platform=darwin_amd64 -platform=linux_amd64\` and commit it`,
    );

  mkdirSync(dst);
  for (const f of readdirSync(src).filter(
    (f) => f.endsWith(".tf") || f === LOCK,
  ))
    cpSync(join(src, f), join(dst, f));
  if (existsSync(join(src, "env")))
    cpSync(join(src, "env"), join(dst, "env"), { recursive: true });
  writeFileSync(join(dst, "plan.tftest.hcl"), MOCK_PLAN);

  try {
    await run(["init", "-backend=false", "-input=false", "-no-color"], dst);
  } catch (e) {
    return [...fail, `${row.name}: init failed\n${errOf(e)}`];
  }

  // `validate -json` exits non-zero when invalid, with the JSON still on stdout.
  const out = await run(["validate", "-json"], dst).catch((e) => e);
  const v = JSON.parse(out.stdout || "{}");
  if (!v.valid || v.warning_count > 0) {
    const msgs = (v.diagnostics ?? []).map(
      (d) =>
        `  ${d.severity}: ${d.summary} (${d.range?.filename}:${d.range?.start?.line})`,
    );
    return [
      ...fail,
      `${row.name}: validate — ${v.error_count} error(s), ${v.warning_count} warning(s)\n${msgs.join("\n")}`,
    ];
  }

  // Pass the dummy ids only where the stack declares them (an undeclared -var is an error).
  const tfSrc = readdirSync(dst)
    .filter((f) => f.endsWith(".tf"))
    .map((f) => readFileSync(join(dst, f), "utf8"))
    .join("\n");
  const ids = ["account_id", "zone_id"].flatMap((k) =>
    new RegExp(`^variable\\s+"${k}"`, "m").test(tfSrc)
      ? ["-var", `${k}=${DUMMY_ID}`]
      : [],
  );
  const envs = existsSync(join(dst, "env"))
    ? readdirSync(join(dst, "env")).filter((f) => f.endsWith(".tfvars"))
    : [];
  for (const tfvars of envs) {
    try {
      await run(["test", "-no-color", `-var-file=env/${tfvars}`, ...ids], dst);
    } catch (e) {
      fail.push(
        `${row.name}/${tfvars}: plan (mock provider) failed\n${errOf(e)}`,
      );
    }
  }
  if (!fail.length)
    console.log(`✓ ${row.name} — fmt · validate · plan × ${envs.length}`);
  return fail;
}

// Download the provider once into the shared cache before the parallel inits race for it.
const [first, ...rest] = INFRA;
const fail = [
  ...(await checkStack(first)),
  ...(await Promise.all(rest.map(checkStack))).flat(),
];
rmSync(work, { recursive: true, force: true });
if (fail.length) {
  console.error(
    `\n✗ check:infra — ${fail.length} failure(s):\n\n${fail.join("\n\n")}`,
  );
  process.exit(1);
}
console.log(`✓ check:infra — ${INFRA.length} stacks clean`);
