#!/usr/bin/env node
/**
 * Bootstrap Clerk admins by email. Sets `public_metadata.role = "admin"` on each
 * user via the Clerk Backend API, so the admin dashboard's role gate lets them in.
 *
 * Why a script: the dashboard's own `grantAdmin` needs an EXISTING admin, so the
 * first admin can't be made from the UI. This is that bootstrap — and it adds more
 * admins later (pass several emails).
 *
 * Run from the repo root:
 *   node code/shared/scripts/data/set-admin.mjs <email> [more emails...]
 *
 * The Clerk secret is read from CLERK_SECRET_KEY, else parsed from a surface's
 * .env.local (default: the app surface). Never pass the secret on the command line.
 * The instance is whichever the secret belongs to: sk_test_ = development, sk_live_
 * = production. Target another env by exporting its CLERK_SECRET_KEY first.
 *
 * A user only exists in Clerk AFTER they sign up once — run this after the person
 * has signed up on a Clerk-enabled surface, or it reports "not-found".
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CLERK_API = "https://api.clerk.com/v1";
const ENV_FILE_DEFAULT = "code/projects/web/surfaces/app/.env.local";

/** Resolve the Clerk secret: env first, else the `CLERK_SECRET_KEY=` line of an .env.local. */
export function loadSecret() {
  if (process.env.CLERK_SECRET_KEY) return process.env.CLERK_SECRET_KEY.trim();
  const path = resolve(
    process.cwd(),
    process.env.CLERK_ENV_FILE || ENV_FILE_DEFAULT,
  );
  try {
    const line = readFileSync(path, "utf8")
      .split("\n")
      .find((l) => l.trim().startsWith("CLERK_SECRET_KEY="));
    if (line) return line.slice(line.indexOf("=") + 1).trim();
  } catch {
    /* fall through to the null return */
  }
  return null;
}

/** Clerk's list-users response is either a bare array or `{ data: [...] }` — normalize. */
export function normalizeUsers(raw) {
  return Array.isArray(raw) ? raw : (raw?.data ?? []);
}

/**
 * The security decision for a fetched user (null = not found). Pure + exported so it
 * is tested without the network. A non-admin role (even a wrong one) must still be
 * (re)granted `admin` — never treated as done.
 */
export function resolveAdminAction(user) {
  if (!user) return "not-found";
  if (user.public_metadata?.role === "admin") return "already-admin";
  return "grant";
}

async function clerk(path, init, key) {
  const res = await fetch(`${CLERK_API}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(`${path} → ${res.status} ${JSON.stringify(body)}`);
  return body;
}

/** Find the user by email, then set role=admin (idempotent). */
async function setAdmin(email, key) {
  const list = normalizeUsers(
    await clerk(
      `/users?email_address=${encodeURIComponent(email)}&limit=1`,
      {},
      key,
    ),
  );
  const user = list[0];
  const action = resolveAdminAction(user);
  if (action === "not-found")
    return {
      email,
      status: "not-found",
      note: "no Clerk user — sign up first",
    };
  if (action === "already-admin")
    return { email, id: user.id, status: "already-admin" };
  await clerk(
    `/users/${user.id}/metadata`,
    {
      method: "PATCH",
      body: JSON.stringify({ public_metadata: { role: "admin" } }),
    },
    key,
  );
  return { email, id: user.id, status: "granted" };
}

async function main() {
  const emails = process.argv.slice(2).filter(Boolean);
  if (emails.length === 0) {
    console.error(
      "Usage: node code/shared/scripts/data/set-admin.mjs <email> [more emails...]",
    );
    process.exit(1);
  }
  const key = loadSecret();
  if (!key) {
    console.error(
      `No CLERK_SECRET_KEY found (env, or ${ENV_FILE_DEFAULT}; override with CLERK_ENV_FILE=<path>).`,
    );
    process.exit(1);
  }
  console.log(
    `Clerk instance: ${key.startsWith("sk_live_") ? "PRODUCTION (sk_live_)" : "development (sk_test_)"}`,
  );
  let failed = 0;
  for (const email of emails) {
    try {
      const r = await setAdmin(email, key);
      const mark =
        r.status === "granted"
          ? "✓ granted admin"
          : r.status === "already-admin"
            ? "• already admin"
            : `⚠ ${r.note}`;
      console.log(`  ${mark}: ${email}${r.id ? ` (${r.id})` : ""}`);
      if (r.status === "not-found") failed++;
    } catch (e) {
      console.error(`  ✗ ${email}: ${e.message}`);
      failed++;
    }
  }
  process.exit(failed > 0 ? 1 : 0);
}

// Run the CLI only when invoked directly — so a test can import the pure helpers above.
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
