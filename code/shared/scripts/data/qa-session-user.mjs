#!/usr/bin/env node
/**
 * QA fixture: a development-only Clerk test user with live sessions, so the admin
 * Sessions screen has someone to revoke ("Revoke" one, "Sign out user" for all).
 *
 * It finds or creates `qa-disconnect+clerk_test@example.com`, opens N Clerk sessions
 * (Backend API `POST /v1/sessions`, development instances only), and logs one sign-in
 * row per session to the shared api (`POST /v1/events`, kind `session`) so each shows
 * in the sessions feed. Re-run it for fresh sessions; `--delete` removes the user.
 *
 * Run from the repo root (needs the local api up for the feed rows):
 *   node code/shared/scripts/data/qa-session-user.mjs [--sessions N] [--delete]
 *
 * Reads CLERK_SECRET_KEY, API_URL and APP_API_TOKEN from the env, else from the admin
 * surface's .env.local (override with QA_ENV_FILE=<path>). Refuses a production key.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeUsers } from "./set-admin.mjs";

const CLERK_API = "https://api.clerk.com/v1";
const ENV_FILE_DEFAULT = "code/projects/web/surfaces/admin/.env.local";
const EMAIL = "qa-disconnect+clerk_test@example.com";
const SURFACES = ["website", "app"];

/** The value of `key` in .env text (first `=` splits), or null. */
export function envValue(text, key) {
  const line = text.split("\n").find((l) => l.trim().startsWith(`${key}=`));
  return line ? line.slice(line.indexOf("=") + 1).trim() || null : null;
}

/** A test user and fake sessions must never reach production. */
export function assertDevKey(key) {
  if (!key?.startsWith("sk_test_"))
    throw new Error("needs a development Clerk key (sk_test_)");
}

/** The api's session-log payload — the same one the surfaces' SessionLogger sends. */
export function sessionEvent(surface, userId, sessionId) {
  return { kind: "session", surface, userId, sessionId };
}

export function parseArgs(argv) {
  const i = argv.indexOf("--sessions");
  const sessions = i === -1 ? 2 : Number(argv[i + 1]);
  if (!Number.isInteger(sessions) || sessions < 1 || sessions > 10)
    throw new Error("--sessions takes 1–10");
  return { sessions, del: argv.includes("--delete") };
}

function loadEnv() {
  let text = "";
  try {
    text = readFileSync(
      resolve(process.cwd(), process.env.QA_ENV_FILE || ENV_FILE_DEFAULT),
      "utf8",
    );
  } catch {
    /* env vars only */
  }
  const get = (k) => process.env[k]?.trim() || envValue(text, k);
  return {
    key: get("CLERK_SECRET_KEY"),
    apiUrl: get("API_URL"),
    token: get("APP_API_TOKEN"),
  };
}

async function clerk(path, key, init = {}) {
  const res = await fetch(`${CLERK_API}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(
      `${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.errors?.[0] ?? body)}`,
    );
  return body;
}

async function main() {
  const { sessions, del } = parseArgs(process.argv.slice(2));
  const { key, apiUrl, token } = loadEnv();
  assertDevKey(key);
  const [existing] = normalizeUsers(
    await clerk(
      `/users?email_address=${encodeURIComponent(EMAIL)}&limit=1`,
      key,
    ),
  );

  if (del) {
    if (!existing) return console.log(`• no user ${EMAIL}`);
    await clerk(`/users/${existing.id}`, key, { method: "DELETE" });
    return console.log(`✓ deleted ${existing.id} (${EMAIL})`);
  }

  const user =
    existing ??
    (await clerk("/users", key, {
      method: "POST",
      body: JSON.stringify({
        email_address: [EMAIL],
        first_name: "QA",
        last_name: "Disconnect",
        skip_password_requirement: true,
      }),
    }));
  console.log(
    `${existing ? "• user exists" : "✓ user created"}: ${user.id} (${EMAIL})`,
  );

  for (let n = 0; n < sessions; n++) {
    const surface = SURFACES[n % SURFACES.length];
    const session = await clerk("/sessions", key, {
      method: "POST",
      body: JSON.stringify({ user_id: user.id }),
    });
    let feed = "no API_URL/APP_API_TOKEN — not in the feed";
    if (apiUrl && token) {
      const res = await fetch(`${apiUrl}/v1/events`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(sessionEvent(surface, user.id, session.id)),
      }).catch((e) => ({ ok: false, status: e.message }));
      feed = res.ok
        ? "in the feed"
        : `feed row failed (${res.status}) — is the api up?`;
    }
    console.log(`  ✓ live session ${session.id} (${surface}) · ${feed}`);
  }
}

// Run the CLI only when invoked directly — so a test can import the pure helpers above.
if (process.argv[1] === fileURLToPath(import.meta.url))
  main().catch((e) => {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  });
