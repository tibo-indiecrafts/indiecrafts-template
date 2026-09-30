import { env, SELF } from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import type { ClerkErasureClient } from "./clerk";
import { createCoreErasureAdapter, createAuditErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { handleErasureClose, handleErasureRetry } from "./admin";

const SALT = "test-fingerprint-salt";
const EMAIL = "stuck-subject@x.com";
const USER = "user_stuck_1";

const testEnv = (): Env => ({
  ...(env as unknown as Env),
  GDPR_FINGERPRINT_SALT: SALT,
});

/** Mock Clerk + Sanity (real D1) — same shape as confirm.test.ts. */
function mockAdapters(clerk: Partial<ClerkErasureClient> = {}) {
  const clerkClient: ClerkErasureClient = {
    findUserIdByEmail: vi.fn(async () => USER),
    exportUser: vi.fn(async () => ({ id: USER })),
    deleteUser: vi.fn(async () => {}),
    ...clerk,
  };
  const sanityClient = {
    findByEmail: vi.fn(async () => []),
    pseudonymise: vi.fn(async () => {}),
  };
  return (e: Env) => [
    createCoreErasureAdapter(e.MAIN_DB!, SALT),
    createAuditErasureAdapter(e.AUDIT_DB!, e.MAIN_DB!, SALT),
    createClerkErasureAdapter(clerkClient),
    createSanityErasureAdapter(sanityClient, SALT),
    createOrdersErasureAdapter(),
  ];
}

async function seed(
  status: string,
  userId: string | null = USER,
  tokenDays = -10,
): Promise<number> {
  const fp = await fingerprintEmail(EMAIL, SALT);
  const now = Date.now();
  const r = await env.MAIN_DB.prepare(
    'INSERT INTO erasure_requests (status, token_hash, token_expires_at, user_id, email_fingerprint, requested_at, due_at, result) VALUES (?, \'h\', ?, ?, ?, ?, ?, \'{"errors":[{"store":"clerk"}]}\') RETURNING id',
  )
    .bind(
      status,
      new Date(now + tokenDays * 86_400_000).toISOString(),
      userId,
      fp,
      new Date(now - 40 * 86_400_000).toISOString(),
      new Date(now - 86_400_000).toISOString(),
    )
    .first<{ id: number }>();
  return r!.id;
}

const rowOf = (id: number) =>
  env.MAIN_DB.prepare(
    "SELECT status, completed_at, result FROM erasure_requests WHERE id = ?",
  )
    .bind(id)
    .first<{
      status: string;
      completed_at: string | null;
      result: string | null;
    }>();

const post = (body: unknown) =>
  new Request("https://api.test/x", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("handleErasureRetry", () => {
  it("409s a request that is not confirmed", async () => {
    const id = await seed("email_sent", USER, 1);
    const res = await handleErasureRetry(post({}), testEnv(), id, {
      buildAdapters: mockAdapters(),
      send: vi.fn(),
      lookupEmail: vi.fn(async () => EMAIL),
    });
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "not_retryable" });
  });

  it("reads the email from Clerk, erases, completes the row and notifies the subject", async () => {
    const id = await seed("confirmed");
    const send = vi.fn(async () => {});
    const lookupEmail = vi.fn(async () => EMAIL);
    const res = await handleErasureRetry(post({}), testEnv(), id, {
      buildAdapters: mockAdapters(),
      send,
      lookupEmail,
    });
    expect(res.status).toBe(200);
    expect(lookupEmail).toHaveBeenCalledWith(expect.anything(), USER);
    expect(send).toHaveBeenCalledTimes(1);
    expect((await rowOf(id))?.status).toBe("completed");
  });

  it("422s when the Clerk user is gone and no email was typed — nothing erased", async () => {
    const id = await seed("confirmed");
    const send = vi.fn();
    const res = await handleErasureRetry(post({}), testEnv(), id, {
      buildAdapters: mockAdapters(),
      send,
      lookupEmail: vi.fn(async () => null),
    });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ error: "email_required" });
    expect((await rowOf(id))?.status).toBe("confirmed");
    expect(send).not.toHaveBeenCalled();
  });

  it("422s when Clerk now holds a different email (fingerprint mismatch) — the operator must type the original", async () => {
    const id = await seed("confirmed");
    const res = await handleErasureRetry(post({}), testEnv(), id, {
      buildAdapters: mockAdapters(),
      send: vi.fn(),
      lookupEmail: vi.fn(async () => "changed@x.com"),
    });
    expect(res.status).toBe(422);
  });

  it("400s a typed email that does not match the fingerprint", async () => {
    const id = await seed("confirmed", null);
    const res = await handleErasureRetry(
      post({ email: "wrong@x.com" }),
      testEnv(),
      id,
      {
        buildAdapters: mockAdapters(),
        send: vi.fn(),
        lookupEmail: vi.fn(async () => null),
      },
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "email_mismatch" });
    expect((await rowOf(id))?.status).toBe("confirmed");
  });

  it("accepts the typed email when it matches and completes the erasure", async () => {
    const id = await seed("confirmed", null);
    const res = await handleErasureRetry(
      post({ email: `  ${EMAIL.toUpperCase()} ` }),
      testEnv(),
      id,
      {
        buildAdapters: mockAdapters(),
        send: vi.fn(async () => {}),
        lookupEmail: vi.fn(async () => null),
      },
    );
    expect(res.status).toBe(200);
    expect((await rowOf(id))?.status).toBe("completed");
  });

  it("502s and keeps the row open when the Clerk delete still fails — no completion email", async () => {
    const id = await seed("confirmed");
    const send = vi.fn();
    const deleteUser = vi.fn(async () => {
      throw new Error("clerk down");
    });
    const res = await handleErasureRetry(post({}), testEnv(), id, {
      buildAdapters: mockAdapters({ deleteUser }),
      send,
      lookupEmail: vi.fn(async () => EMAIL),
    });
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ ok: false, clerk_failed: true });
    expect((await rowOf(id))?.status).toBe("confirmed");
    expect(send).not.toHaveBeenCalled();
  });

  it("404s an unknown id", async () => {
    const res = await handleErasureRetry(post({}), testEnv(), 999_999, {
      buildAdapters: mockAdapters(),
      send: vi.fn(),
      lookupEmail: vi.fn(async () => EMAIL),
    });
    expect(res.status).toBe(404);
  });
});

describe("handleErasureClose", () => {
  it("400s a missing or too-short note", async () => {
    const id = await seed("confirmed");
    for (const note of [undefined, "   ", "abc"]) {
      const res = await handleErasureClose(
        post({ note, by: "user_admin" }),
        testEnv(),
        id,
      );
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "note_required" });
    }
  });

  it("409s a request that is no longer open", async () => {
    const id = await seed("completed");
    const res = await handleErasureClose(
      post({ note: "handled by hand", by: "user_admin" }),
      testEnv(),
      id,
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "not_open" });
    expect((await rowOf(id))?.status).toBe("completed");
  });

  it("closes an open request with the note, who and when", async () => {
    const id = await seed("confirmed");
    const res = await handleErasureClose(
      post({ note: "  Erased by hand in Sanity  ", by: "user_admin" }),
      testEnv(),
      id,
    );
    expect(res.status).toBe(200);
    const row = await rowOf(id);
    expect(row?.status).toBe("closed_manual");
    expect(row?.completed_at).toBeTruthy();
    const result = JSON.parse(row!.result!) as {
      errors: unknown[];
      manualClose: { note: string; by: string; at: string };
    };
    expect(result.manualClose).toMatchObject({
      note: "Erased by hand in Sanity",
      by: "user_admin",
    });
    expect(result.errors).toEqual([{ store: "clerk" }]); // the prior receipt is kept
  });
});

describe("routes", () => {
  it("401 without the bearer", async () => {
    for (const path of [
      "/v1/erasure-requests/1/retry",
      "/v1/erasure-requests/1/close",
    ])
      expect(
        (await SELF.fetch(`https://api.test${path}`, { method: "POST" }))
          .status,
      ).toBe(401);
  });
  it("a closed request leaves the monitoring open list", async () => {
    const id = await seed("confirmed");
    const auth = {
      authorization: "Bearer test-token",
      "content-type": "application/json",
    };
    const close = await SELF.fetch(
      `https://api.test/v1/erasure-requests/${id}/close`,
      {
        method: "POST",
        headers: auth,
        body: JSON.stringify({ note: "duplicate request", by: "user_admin" }),
      },
    );
    expect(close.status).toBe(200);
    const list = (await (
      await SELF.fetch("https://api.test/v1/erasure-requests", {
        headers: auth,
      })
    ).json()) as {
      open: { id: number }[];
    };
    expect(list.open.map((r) => r.id)).not.toContain(id);
  });
});
