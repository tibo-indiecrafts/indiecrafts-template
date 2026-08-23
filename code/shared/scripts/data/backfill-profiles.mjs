#!/usr/bin/env node
// One-time seed: list every Clerk user and upsert a user_profiles row so
// existing users are visible to erasure before their next login. Idempotent
// (ON CONFLICT). Requires CLERK_SECRET_KEY + GDPR_FINGERPRINT_SALT in env, and
// wrangler auth. Usage: pnpm db:backfill:profiles:<env>
//
// Operator prerequisite: `@clerk/backend` is NOT a repo dependency (this is a
// one-time script; adding it would sweep an unrelated pnpm-lock.yaml diff into
// every commit). Before running, install it once yourself:
//   pnpm add -Dw @clerk/backend
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { APPS } from "../lib/apps.mjs";
import { assertRenamed } from "../lib/project.mjs";

// MUST match fingerprintEmail() in
// code/packages/shared/security/src/crypto.ts — salted SHA-256 hex over
// `salt + email.toLowerCase().trim()`. Crosses the TS/mjs boundary for a
// one-time seed; the known-answer test guards against drift.
const fingerprint = (email, salt) =>
  createHash("sha256")
    .update(salt + email.toLowerCase().trim())
    .digest("hex");

const sqlStr = (v) =>
  v == null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;

export function buildUpsertSql(users, salt, now) {
  return users
    .map((u) => {
      const email = u.email ?? null;
      const fp = email ? fingerprint(email, salt) : null;
      return (
        "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at) VALUES (" +
        [
          sqlStr(u.id),
          sqlStr(email),
          sqlStr(u.fullName),
          sqlStr(fp),
          sqlStr(now),
        ].join(", ") +
        ") ON CONFLICT(user_id) DO UPDATE SET email = excluded.email, full_name = excluded.full_name, email_fingerprint = excluded.email_fingerprint;"
      );
    })
    .join("\n");
}

async function listAllUsers(clerk) {
  const users = [];
  const limit = 50; // SDK cap per call
  for (let offset = 0; ; offset += limit) {
    const { data, totalCount } = await clerk.users.getUserList({
      limit,
      offset,
      orderBy: "-created_at",
    });
    for (const u of data) {
      // @clerk/backend is camelCase (unlike the webhook payload's snake_case).
      const email =
        u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
          ?.emailAddress ??
        u.emailAddresses[0]?.emailAddress ??
        null;
      const fullName =
        [u.firstName, u.lastName].filter(Boolean).join(" ") || null;
      users.push({ id: u.id, email, fullName });
    }
    if (offset + limit >= totalCount || data.length === 0) break;
  }
  return users;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const env = process.argv[2];
  if (!["dev", "staging", "prod"].includes(env)) {
    console.error("Usage: backfill-profiles.mjs <dev|staging|prod>");
    process.exit(1);
  }
  const secretKey = process.env.CLERK_SECRET_KEY;
  const salt = process.env.GDPR_FINGERPRINT_SALT;
  if (!secretKey || !salt) {
    console.error("Set CLERK_SECRET_KEY and GDPR_FINGERPRINT_SALT in env.");
    process.exit(1);
  }
  assertRenamed("api", env);

  // Lazy import: @clerk/backend is an operator prerequisite, not a repo
  // dependency (see header). Loading it only here keeps the pure
  // buildUpsertSql (and this module's top level) importable — and testable —
  // without it installed.
  const { createClerkClient } = await import("@clerk/backend");
  const clerk = createClerkClient({ secretKey });
  const users = await listAllUsers(clerk);
  if (users.length === 0) {
    console.log("No Clerk users — nothing to backfill.");
    process.exit(0);
  }
  // ponytail: single SQL file for the whole set. Chunk if users.length > ~10k.
  const now = new Date().toISOString();
  const sql = buildUpsertSql(users, salt, now);
  const dir = mkdtempSync(join(tmpdir(), "backfill-"));
  const file = join(dir, "backfill.sql");
  writeFileSync(file, sql, { mode: 0o600 });
  const pkg =
    APPS.find((a) => a.slug === "api")?.pkg ?? "@indiecrafts/shared-api";
  const scope =
    env === "dev" ? ["--env", "dev", "--local"] : ["--env", env, "--remote"];
  // process.exit() cuts a pending `finally`, so capture the status and exit
  // AFTER the try/finally — otherwise the temp file (plaintext PII) never gets
  // cleaned up. `?? 1` so a signal-killed spawn (status null) reports failure.
  let status = 0;
  try {
    console.log(
      `Backfilling ${users.length} users into user_profiles (${env})…`,
    );
    const r = spawnSync(
      "pnpm",
      [
        "--filter",
        pkg,
        "exec",
        "wrangler",
        "d1",
        "execute",
        "DB",
        ...scope,
        "--file",
        file,
      ],
      { stdio: "inherit" },
    );
    status = r.status ?? 1;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  process.exit(status);
}
