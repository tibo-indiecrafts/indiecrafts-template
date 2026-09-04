import { env, SELF } from "cloudflare:test";
import {
  fingerprintEmail,
  sha256Hex,
} from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import type { ClerkErasureClient } from "./clerk";
import { createCoreErasureAdapter, createAuditErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { handleErasureConfirm } from "./confirm";

const SALT = "test-fingerprint-salt";
const EMAIL = "confirm-subject@x.com";
const USER = "user_confirm_1";

function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    ...(env as unknown as Env),
    GDPR_FINGERPRINT_SALT: SALT,
    ...overrides,
  };
}

function postForm(body: Record<string, string>): Request {
  return new Request("https://example.com/v1/erasure/confirm", {
    method: "POST",
    body: new URLSearchParams(body),
  });
}

async function seedProfile(): Promise<string> {
  const fp = await fingerprintEmail(EMAIL, SALT);
  await env.DB.prepare(
    "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind(USER, EMAIL, fp, new Date(0).toISOString())
    .run();
  return fp;
}

async function seedRequest(overrides: {
  fp: string;
  status?: string;
  tokenExpiresAt?: string;
  attempts?: number;
}): Promise<string> {
  const token = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO erasure_requests (status, token_hash, token_expires_at, attempts, user_id, email_fingerprint, requested_at, due_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      overrides.status ?? "email_sent",
      await sha256Hex(token),
      overrides.tokenExpiresAt ?? new Date(now + 60_000).toISOString(),
      overrides.attempts ?? 0,
      USER,
      overrides.fp,
      new Date(now).toISOString(),
      new Date(now + 1000).toISOString(),
    )
    .run();
  return token;
}

/** Mock Clerk + Sanity clients (real D1 + real orders no-op) — no SDK/HTTP. */
function mockAdapters(clerkOverrides: Partial<ClerkErasureClient> = {}) {
  const clerkClient: ClerkErasureClient = {
    findUserIdByEmail: vi.fn(async () => USER),
    exportUser: vi.fn(async () => ({ id: USER })),
    deleteUser: vi.fn(async () => {}),
    ...clerkOverrides,
  };
  const sanityClient = {
    findByEmail: vi.fn(async (type: string) =>
      type === "subscriber" ? [{ _id: "sub1" }] : [],
    ),
    pseudonymise: vi.fn(async () => {}),
  };
  const build = (buildEnv: Env) => [
    createCoreErasureAdapter(buildEnv.CORE_DB!, SALT),
    createAuditErasureAdapter(buildEnv.DB!, buildEnv.CORE_DB!, SALT),
    createClerkErasureAdapter(clerkClient),
    createSanityErasureAdapter(sanityClient, SALT),
    createOrdersErasureAdapter(),
  ];
  return { clerkClient, sanityClient, build };
}

async function profileAnonymized(): Promise<number | undefined> {
  const row = await env.DB.prepare(
    "SELECT anonymized FROM user_profiles WHERE user_id = ?",
  )
    .bind(USER)
    .first<{ anonymized: number }>();
  return row?.anonymized;
}

describe("GET /v1/erasure/confirm", () => {
  it("renders the confirm form and mutates nothing (routed through the worker)", async () => {
    const fp = await seedProfile();
    const token = await seedRequest({ fp });

    const res = await SELF.fetch(
      `https://example.com/v1/erasure/confirm?token=${token}`,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    const html = await res.text();
    expect(html).toContain('action="/v1/erasure/confirm"');
    expect(html).toContain(token);

    const row = await env.DB.prepare(
      "SELECT status, attempts FROM erasure_requests WHERE email_fingerprint = ?",
    )
      .bind(fp)
      .first<{ status: string; attempts: number }>();
    expect(row?.status).toBe("email_sent");
    expect(row?.attempts).toBe(0);
    expect(await profileAnonymized()).toBe(0);
  });
});

describe("POST /v1/erasure/confirm", () => {
  it("503s on a partial-config deploy (no Clerk/Sanity secrets) without running the engine, leaving the row retryable", async () => {
    const fp = await seedProfile();
    const token = await seedRequest({ fp });

    // No 4th `build` arg — this exercises the real `buildErasureAdapters` path, against
    // a testEnv() that has DB + salt but no Clerk/Sanity secrets.
    const res = await handleErasureConfirm(
      postForm({ token, email: EMAIL }),
      testEnv(),
    );
    expect(res.status).toBe(503);

    const row = await env.DB.prepare(
      "SELECT status, attempts FROM erasure_requests WHERE email_fingerprint = ?",
    )
      .bind(fp)
      .first<{ status: string; attempts: number }>();
    expect(row?.status).toBe("email_sent");
    expect(row?.attempts).toBe(0);
    expect(await profileAnonymized()).toBe(0);
  });

  it("erases on the correct token + email: D1 pseudonymised, row completed, audit written, Clerk/Sanity invoked", async () => {
    const fp = await seedProfile();
    const token = await seedRequest({ fp });
    const { clerkClient, sanityClient, build } = mockAdapters();

    const res = await handleErasureConfirm(
      postForm({ token, email: EMAIL }),
      testEnv(),
      undefined,
      build,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });

    expect(await profileAnonymized()).toBe(1);

    const row = await env.DB.prepare(
      "SELECT status, result, completed_at FROM erasure_requests WHERE email_fingerprint = ?",
    )
      .bind(fp)
      .first<{ status: string; result: string; completed_at: string | null }>();
    expect(row?.status).toBe("completed");
    expect(row?.completed_at).toBeTruthy();
    const receipt = JSON.parse(row!.result) as {
      errors: unknown[];
      stores: Array<{ store: string }>;
    };
    expect(receipt.errors).toEqual([]);
    // Both D1 adapters ran back-to-back: core's anonymize (email_fingerprint kept)
    // still lets audit's resolveSubject find the user afterward.
    expect(receipt.stores.map((s) => s.store).sort()).toEqual([
      "clerk",
      "d1-audit",
      "d1-core",
      "orders",
      "sanity",
    ]);

    const audit = await env.DB.prepare(
      "SELECT actor_user_id, target_user_id FROM admin_audit WHERE event = 'erasure.completed'",
    ).first<{ actor_user_id: string; target_user_id: string }>();
    expect(audit?.actor_user_id).toBe(USER);
    expect(audit?.target_user_id).toBe(USER);

    expect(clerkClient.deleteUser).toHaveBeenCalledWith(USER);
    expect(sanityClient.pseudonymise).toHaveBeenCalled();
  });

  it("rejects a wrong typed email, increments attempts, and erases nothing", async () => {
    const fp = await seedProfile();
    const token = await seedRequest({ fp });
    const { build } = mockAdapters();

    const res = await handleErasureConfirm(
      postForm({ token, email: "someone-else@x.com" }),
      testEnv(),
      undefined,
      build,
    );
    expect(res.status).toBe(400);

    const row = await env.DB.prepare(
      "SELECT attempts, status FROM erasure_requests WHERE email_fingerprint = ?",
    )
      .bind(fp)
      .first<{ attempts: number; status: string }>();
    expect(row?.attempts).toBe(1);
    expect(row?.status).toBe("email_sent");
    expect(await profileAnonymized()).toBe(0);
  });

  it("rejects an expired token and does not erase", async () => {
    const fp = await seedProfile();
    const token = await seedRequest({
      fp,
      tokenExpiresAt: new Date(Date.now() - 60_000).toISOString(),
    });
    const { build } = mockAdapters();

    const res = await handleErasureConfirm(
      postForm({ token, email: EMAIL }),
      testEnv(),
      undefined,
      build,
    );
    expect(res.status).toBe(400);

    const row = await env.DB.prepare(
      "SELECT status FROM erasure_requests WHERE email_fingerprint = ?",
    )
      .bind(fp)
      .first<{ status: string }>();
    expect(row?.status).toBe("expired");
    expect(await profileAnonymized()).toBe(0);
  });

  it("rejects the 6th confirm attempt", async () => {
    const fp = await seedProfile();
    const token = await seedRequest({ fp, attempts: 5 });
    const { build } = mockAdapters();

    const res = await handleErasureConfirm(
      postForm({ token, email: EMAIL }),
      testEnv(),
      undefined,
      build,
    );
    expect(res.status).toBe(429);
    expect(await profileAnonymized()).toBe(0);
  });

  it("rejects replay after the row is already completed", async () => {
    const fp = await seedProfile();
    const token = await seedRequest({ fp, status: "completed" });
    const { build } = mockAdapters();

    const res = await handleErasureConfirm(
      postForm({ token, email: EMAIL }),
      testEnv(),
      undefined,
      build,
    );
    expect(res.status).toBe(400);
    expect(await profileAnonymized()).toBe(0);
  });

  it("reflects a partial failure when an adapter throws, and still runs the D1 half", async () => {
    const fp = await seedProfile();
    const token = await seedRequest({ fp });
    const { build } = mockAdapters({
      deleteUser: vi.fn(async () => {
        throw new Error("clerk down");
      }),
    });

    const res = await handleErasureConfirm(
      postForm({ token, email: EMAIL }),
      testEnv(),
      undefined,
      build,
    );
    expect(res.status).toBe(207);
    const body = (await res.json()) as {
      ok: boolean;
      partial: boolean;
      errors: Array<{ store: string; error: string }>;
    };
    expect(body.partial).toBe(true);
    expect(body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ store: "clerk" })]),
    );

    const row = await env.DB.prepare(
      "SELECT status, result FROM erasure_requests WHERE email_fingerprint = ?",
    )
      .bind(fp)
      .first<{ status: string; result: string }>();
    expect(row?.status).not.toBe("completed");
    const receipt = JSON.parse(row!.result) as { errors: unknown[] };
    expect(receipt.errors.length).toBeGreaterThan(0);

    // The D1 half still ran despite Clerk failing — not a blind success either way.
    expect(await profileAnonymized()).toBe(1);
  });
});
