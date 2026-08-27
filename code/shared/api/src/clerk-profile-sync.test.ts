import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it } from "vitest";
import worker from "./index";

const SECRET = "whsec_dGVzdHNlY3JldA=="; // base64("testsecret")
const SALT = "test-fingerprint-salt";

// Sign a body the same way verifySvix() verifies it (Web Crypto, workerd).
async function svixHeaders(id: string, ts: string, body: string) {
  const secretBytes = Uint8Array.from(
    atob(SECRET.replace(/^whsec_/, "")),
    (c) => c.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${ts}.${body}`),
  );
  const sig = btoa(String.fromCharCode(...new Uint8Array(mac)));
  return {
    "svix-id": id,
    "svix-timestamp": ts,
    "svix-signature": `v1,${sig}`,
    "content-type": "application/json",
  };
}

async function postWebhook(payload: unknown) {
  const body = JSON.stringify(payload);
  const ts = String(Math.floor(Date.now() / 1000));
  const req = new Request("https://example.com/v1/clerk-webhook", {
    method: "POST",
    body,
    headers: await svixHeaders("msg_1", ts, body),
  });
  const ctx = createExecutionContext();
  // Override env per-test so the global 503-no-secret test stays valid.
  const res = await worker.fetch(
    req,
    {
      ...env,
      CLERK_WEBHOOK_SECRET: SECRET,
      GDPR_FINGERPRINT_SALT: SALT,
      // Present so the user.deleted full-engine erasure can build its adapters.
      SANITY_PROJECT_ID: "pid",
      SANITY_DATASET: "production",
      SANITY_API_WRITE_TOKEN: "sk_sanity",
    },
    ctx,
  );
  await waitOnExecutionContext(ctx);
  return res;
}

const created = (id: string, email: string, first = "", last = "") => ({
  type: "user.created",
  data: {
    id,
    primary_email_address_id: "e1",
    email_addresses: [{ id: "e1", email_address: email }],
    first_name: first,
    last_name: last,
  },
});

describe("clerk webhook → user_profiles", () => {
  it("user.created upserts a fingerprinted profile", async () => {
    const res = await postWebhook(
      created("user_c", "Jane@Example.com", "Jane", "Doe"),
    );
    expect(res.status).toBe(200);
    const row = await env.DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_c")
      .first<Record<string, unknown>>();
    expect(row?.email).toBe("Jane@Example.com");
    expect(row?.full_name).toBe("Jane Doe");
    expect(row?.email_fingerprint).toBe(
      await fingerprintEmail("Jane@Example.com", SALT),
    );
    expect(row?.anonymized).toBe(0);
  });

  it("is idempotent — replaying user.created keeps one row", async () => {
    await postWebhook(created("user_dup", "dup@x.com"));
    await postWebhook(created("user_dup", "dup@x.com"));
    const { results } = await env.DB.prepare(
      "SELECT user_id FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_dup")
      .all();
    expect(results.length).toBe(1);
  });

  it("user.updated re-fingerprints on email change, keeps created_at", async () => {
    await postWebhook(created("user_u", "old@x.com"));
    const before = await env.DB.prepare(
      "SELECT created_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_u")
      .first<{ created_at: string }>();
    await postWebhook({
      type: "user.updated",
      data: {
        id: "user_u",
        primary_email_address_id: "e2",
        email_addresses: [{ id: "e2", email_address: "new@x.com" }],
      },
    });
    const after = await env.DB.prepare(
      "SELECT email, email_fingerprint, created_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_u")
      .first<Record<string, unknown>>();
    expect(after?.email).toBe("new@x.com");
    expect(after?.email_fingerprint).toBe(
      await fingerprintEmail("new@x.com", SALT),
    );
    expect(after?.created_at).toBe(before?.created_at);
  });

  it("user.updated with no resolvable email keeps the stored email + fingerprint", async () => {
    await postWebhook(created("user_ne", "keep@x.com", "Keep"));
    const before = await env.DB.prepare(
      "SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_ne")
      .first<Record<string, unknown>>();
    await postWebhook({
      type: "user.updated",
      data: { id: "user_ne", first_name: "Keep", last_name: "Updated" },
    });
    const after = await env.DB.prepare(
      "SELECT email, email_fingerprint, full_name FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_ne")
      .first<Record<string, unknown>>();
    expect(after?.email).toBe(before?.email);
    expect(after?.email_fingerprint).toBe(before?.email_fingerprint);
    expect(after?.full_name).toBe("Keep Updated"); // full_name still propagates
  });

  it("user.deleted pseudonymises but keeps the row + fingerprint", async () => {
    await postWebhook(created("user_d", "d@x.com", "Dee"));
    const fpBefore = (
      await env.DB.prepare(
        "SELECT email_fingerprint FROM user_profiles WHERE user_id = ?",
      )
        .bind("user_d")
        .first<{ email_fingerprint: string }>()
    )?.email_fingerprint;
    await postWebhook({
      type: "user.deleted",
      data: { id: "user_d", deleted: true },
    });
    const row = await env.DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_d")
      .first<Record<string, unknown>>();
    expect(row?.email).toBe("deleted_user_d@anonymized.local");
    expect(row?.full_name).toBe("Deleted User");
    expect(row?.anonymized).toBe(1);
    expect(row?.deleted_at).toBeTruthy();
    expect(row?.email_fingerprint).toBe(fpBefore); // retained for retention matching
  });

  it("user.deleted runs the full engine across the other stores (audit erased)", async () => {
    await postWebhook(created("user_erase", "erase@x.com", "Er", "Ase"));
    // Seed an audit store the engine must erase (session_events, deleted by user_id).
    await env.DB.prepare(
      "INSERT INTO session_events (ts, surface, user_id, session_id) VALUES (?, ?, ?, ?)",
    )
      .bind(new Date(0).toISOString(), "website", "user_erase", "sess_1")
      .run();
    const before = await env.DB.prepare(
      "SELECT COUNT(*) c FROM session_events WHERE user_id = ?",
    )
      .bind("user_erase")
      .first<{ c: number }>();
    expect(before?.c).toBe(1);

    await postWebhook({
      type: "user.deleted",
      data: { id: "user_erase", deleted: true },
    });

    // Profile pseudonymised immediately (the sync UPDATE — unchanged behavior).
    const prof = await env.DB.prepare(
      "SELECT anonymized FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_erase")
      .first<{ anonymized: number }>();
    expect(prof?.anonymized).toBe(1);
    // The full engine also erased the audit store (async, flushed by waitOnExecutionContext).
    const after = await env.DB.prepare(
      "SELECT COUNT(*) c FROM session_events WHERE user_id = ?",
    )
      .bind("user_erase")
      .first<{ c: number }>();
    expect(after?.c).toBe(0);
  });
});
