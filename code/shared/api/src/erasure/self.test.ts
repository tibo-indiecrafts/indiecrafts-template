import { env } from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import { createCoreErasureAdapter, createAuditErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { handleErasureSelf } from "./self";

const SALT = "test-fingerprint-salt";
const EMAIL = "self-subject@x.com";
const USER = "user_self_1";

function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    ...(env as unknown as Env),
    GDPR_FINGERPRINT_SALT: SALT,
    // Present so the buildErasureAdapters secret preflight passes when the real
    // build is used; the injected build ignores them (no real client made).
    CLERK_SECRET_KEY: "sk_test",
    SANITY_API_WRITE_TOKEN: "sk_sanity",
    SANITY_PROJECT_ID: "pid",
    SANITY_DATASET: "production",
    ...overrides,
  };
}

function postJson(body: Record<string, unknown>): Request {
  return new Request("https://example.com/v1/erasure/self", {
    method: "POST",
    headers: {
      authorization: "Bearer tkn",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

/** A request whose actual body exceeds BODY_MAX, with an optional content-length lie. */
function oversizedRequest(lieContentLength?: string): Request {
  const body = JSON.stringify({
    email: EMAIL,
    feedback: "x".repeat(4100),
  });
  const headers: Record<string, string> = {
    authorization: "Bearer tkn",
    "content-type": "application/json",
  };
  if (lieContentLength !== undefined)
    headers["content-length"] = lieContentLength;
  return new Request("https://example.com/v1/erasure/self", {
    method: "POST",
    headers,
    body,
  });
}

async function seedProfile(): Promise<string> {
  const fp = await fingerprintEmail(EMAIL, SALT);
  await env.AUDIT_DB.prepare(
    "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind(USER, EMAIL, fp, new Date(0).toISOString())
    .run();
  return fp;
}

/** Injected auth (no real Clerk) + injected adapters (real D1 + mocked Clerk/Sanity). */
function mocks(
  authResult: {
    userId: string;
    email: string;
    fvaMinutes: number | null;
  } | null = {
    userId: USER,
    email: EMAIL,
    fvaMinutes: 0,
  },
) {
  const authenticate = vi.fn(async () => authResult);
  const clerkClient = {
    findUserIdByEmail: vi.fn(async () => USER),
    exportUser: vi.fn(async () => ({ id: USER })),
    deleteUser: vi.fn(async () => {}),
  };
  const sanityClient = {
    findByEmail: vi.fn(async () => []),
    pseudonymise: vi.fn(async () => {}),
  };
  const build = (e: Env) => [
    createCoreErasureAdapter(e.MAIN_DB!, SALT),
    createAuditErasureAdapter(e.AUDIT_DB!, e.MAIN_DB!, SALT),
    createClerkErasureAdapter(clerkClient),
    createSanityErasureAdapter(sanityClient, SALT),
    createOrdersErasureAdapter(),
  ];
  return { authenticate, clerkClient, build };
}

describe("handleErasureSelf", () => {
  it("erases when the JWT is valid and the typed email matches", async () => {
    await seedProfile();
    const { authenticate, build, clerkClient } = mocks();
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(200);
    expect(clerkClient.deleteUser).toHaveBeenCalledWith(USER);
    const row = await env.AUDIT_DB.prepare(
      "SELECT status FROM erasure_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ status: string }>();
    expect(row?.status).toBe("completed");
    // A completion audit row was written.
    const audit = await env.AUDIT_DB.prepare(
      "SELECT event FROM admin_audit WHERE target_user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ event: string }>();
    expect(audit?.event).toBe("erasure.self");
  });

  it("writes a churn row and suppresses (not deletes) the Resend contact", async () => {
    await seedProfile();
    const { authenticate, build } = mocks();
    const suppress = vi.fn(async () => {});
    const fetchPrefs = vi.fn(async () => ({
      categories: [],
      notices: [],
      churnedTopicId: "top_churn",
      optOutTopicIds: ["top_news"],
    }));
    const res = await handleErasureSelf(
      postJson({
        email: EMAIL,
        reason: "too_expensive",
        feedback: "pricey",
        competitor: "Acme",
      }),
      testEnv(),
      undefined,
      build,
      authenticate,
      suppress,
      fetchPrefs,
    );
    expect(res.status).toBe(200);
    expect(suppress).toHaveBeenCalledWith(expect.anything(), {
      email: EMAIL,
      reason: "too_expensive",
      churnedTopicId: "top_churn",
      optOutTopicIds: ["top_news"],
    });
    const row = await env.MAIN_DB.prepare(
      "SELECT reason, feedback FROM churn_events WHERE user_id = ?",
    )
      .bind(USER)
      .first<{ reason: string | null; feedback: string | null }>();
    expect(row?.reason).toBe("too_expensive");
    expect(row?.feedback).toBe("pricey");
  });

  it("nulls an unknown churn reason but still completes with 200", async () => {
    await seedProfile();
    const { authenticate, build } = mocks();
    const res = await handleErasureSelf(
      postJson({ email: EMAIL, reason: "garbage" }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(200);
    const row = await env.MAIN_DB.prepare(
      "SELECT reason FROM churn_events WHERE user_id = ?",
    )
      .bind(USER)
      .first<{ reason: string | null }>();
    expect(row?.reason).toBeNull();
  });

  it("rejects an oversized body with no content-length header", async () => {
    await seedProfile();
    const { authenticate, build, clerkClient } = mocks();
    const res = await handleErasureSelf(
      oversizedRequest(),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(400);
    expect(clerkClient.deleteUser).not.toHaveBeenCalled();
  });

  it("rejects an oversized body even with a lying (small) content-length header", async () => {
    await seedProfile();
    const { authenticate, build, clerkClient } = mocks();
    const res = await handleErasureSelf(
      oversizedRequest("10"),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(400);
    expect(clerkClient.deleteUser).not.toHaveBeenCalled();
  });

  it("rejects a typed email that does not match the authenticated email", async () => {
    await seedProfile();
    const { authenticate, build, clerkClient } = mocks();
    const res = await handleErasureSelf(
      postJson({ email: "wrong@x.com" }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(400);
    expect(clerkClient.deleteUser).not.toHaveBeenCalled();
  });

  it("returns 401 when the JWT is missing or invalid", async () => {
    const { build } = mocks();
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      vi.fn(async () => null),
    );
    expect(res.status).toBe(401);
  });

  it("returns 503 when CLERK_SECRET_KEY is unset (real adapters would need it)", async () => {
    const { authenticate } = mocks();
    // No 4th arg → buildErasureAdapters; env missing CLERK_SECRET_KEY.
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv({ CLERK_SECRET_KEY: undefined }),
      undefined,
      undefined,
      authenticate,
    );
    expect(res.status).toBe(503);
  });

  it("returns 207 partial when a non-clerk store fails (clerk delete OK)", async () => {
    await seedProfile();
    const { authenticate, clerkClient } = mocks();
    const build = (e: Env) => [
      createCoreErasureAdapter(e.MAIN_DB!, SALT),
      createAuditErasureAdapter(e.AUDIT_DB!, e.MAIN_DB!, SALT),
      createClerkErasureAdapter(clerkClient),
      createSanityErasureAdapter(
        {
          findByEmail: vi.fn(async () => {
            throw new Error("sanity down");
          }),
          pseudonymise: vi.fn(async () => {}),
        },
        SALT,
      ),
      createOrdersErasureAdapter(),
    ];
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(207);
    expect(clerkClient.deleteUser).toHaveBeenCalledWith(USER);
    const row = await env.AUDIT_DB.prepare(
      "SELECT status, completed_at FROM erasure_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ status: string; completed_at: string | null }>();
    expect(row?.status).toBe("confirmed");
    // A partial run is not "completed" — the completion timestamp stays null.
    expect(row?.completed_at).toBeNull();
    // The accountability trail is still written on the partial path.
    const audit = await env.AUDIT_DB.prepare(
      "SELECT event FROM admin_audit WHERE target_user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ event: string }>();
    expect(audit?.event).toBe("erasure.self");
  });

  it("signals failure (not partial/done) when the clerk delete fails and the retry also fails — the session must not appear killed", async () => {
    await seedProfile();
    const { authenticate } = mocks();
    const clerkClient = {
      findUserIdByEmail: vi.fn(async () => USER),
      exportUser: vi.fn(async () => ({ id: USER })),
      deleteUser: vi.fn(async () => {
        throw new Error("clerk down");
      }),
    };
    const build = (e: Env) => [
      createCoreErasureAdapter(e.MAIN_DB!, SALT),
      createAuditErasureAdapter(e.AUDIT_DB!, e.MAIN_DB!, SALT),
      createClerkErasureAdapter(clerkClient),
      createSanityErasureAdapter(
        {
          findByEmail: vi.fn(async () => []),
          pseudonymise: vi.fn(async () => {}),
        },
        SALT,
      ),
      createOrdersErasureAdapter(),
    ];
    const res = await handleErasureSelf(
      postJson({ email: EMAIL, reason: "too_expensive" }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    // Retried once, still failed.
    expect(clerkClient.deleteUser).toHaveBeenCalledTimes(2);
    // NOT 200 and NOT 207 — the client's mapErasureResponse treats any status
    // outside {200, 207, 400} as "error", so it never fires onDeleted (local
    // sign-out) on this response.
    expect(res.status).not.toBe(200);
    expect(res.status).not.toBe(207);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(false);
    // The mitigation stays: the row is `confirmed` (not `completed`), so the
    // manual-backfill email path still applies.
    const row = await env.AUDIT_DB.prepare(
      "SELECT status, completed_at FROM erasure_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ status: string; completed_at: string | null }>();
    expect(row?.status).toBe("confirmed");
    expect(row?.completed_at).toBeNull();
    // Task 3's churn write still ran.
    const churn = await env.MAIN_DB.prepare(
      "SELECT reason FROM churn_events WHERE user_id = ?",
    )
      .bind(USER)
      .first<{ reason: string | null }>();
    expect(churn?.reason).toBe("too_expensive");
  });

  it("succeeds when the clerk delete fails once but the inline retry succeeds", async () => {
    await seedProfile();
    const { authenticate } = mocks();
    let calls = 0;
    const clerkClient = {
      findUserIdByEmail: vi.fn(async () => USER),
      exportUser: vi.fn(async () => ({ id: USER })),
      deleteUser: vi.fn(async () => {
        calls += 1;
        if (calls === 1) throw new Error("transient clerk failure");
      }),
    };
    const build = (e: Env) => [
      createCoreErasureAdapter(e.MAIN_DB!, SALT),
      createAuditErasureAdapter(e.AUDIT_DB!, e.MAIN_DB!, SALT),
      createClerkErasureAdapter(clerkClient),
      createSanityErasureAdapter(
        {
          findByEmail: vi.fn(async () => []),
          pseudonymise: vi.fn(async () => {}),
        },
        SALT,
      ),
      createOrdersErasureAdapter(),
    ];
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(clerkClient.deleteUser).toHaveBeenCalledTimes(2);
    expect(res.status).toBe(200);
    const row = await env.AUDIT_DB.prepare(
      "SELECT status, completed_at FROM erasure_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ status: string; completed_at: string | null }>();
    expect(row?.status).toBe("completed");
    expect(row?.completed_at).not.toBeNull();
  });

  it("returns reverification-required when the first-factor age is stale (> 10 min)", async () => {
    await seedProfile();
    const { build, clerkClient } = mocks();
    const authenticate = vi.fn(async () => ({
      userId: USER,
      email: EMAIL,
      fvaMinutes: 45,
    }));
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(403);
    const body = (await res.json()) as {
      clerk_error: { reason: string; metadata: { reverification: unknown } };
    };
    expect(body.clerk_error.reason).toBe("reverification-error");
    expect(body.clerk_error.metadata.reverification).toEqual({
      level: "first_factor",
      afterMinutes: 10,
    });
    expect(clerkClient.deleteUser).not.toHaveBeenCalled();
  });

  it("returns reverification-required when fvaMinutes is null", async () => {
    await seedProfile();
    const { build, clerkClient } = mocks();
    const authenticate = vi.fn(async () => ({
      userId: USER,
      email: EMAIL,
      fvaMinutes: null,
    }));
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(403);
    const body = (await res.json()) as { clerk_error: { reason: string } };
    expect(body.clerk_error.reason).toBe("reverification-error");
    expect(clerkClient.deleteUser).not.toHaveBeenCalled();
  });

  it("returns reverification-required when fvaMinutes is -1 (not applicable)", async () => {
    await seedProfile();
    const { build, clerkClient } = mocks();
    const authenticate = vi.fn(async () => ({
      userId: USER,
      email: EMAIL,
      fvaMinutes: -1,
    }));
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(403);
    const body = (await res.json()) as { clerk_error: { reason: string } };
    expect(body.clerk_error.reason).toBe("reverification-error");
    expect(clerkClient.deleteUser).not.toHaveBeenCalled();
  });

  it("proceeds when the first-factor age is fresh (<= 10 min)", async () => {
    await seedProfile();
    const { build, clerkClient } = mocks();
    const authenticate = vi.fn(async () => ({
      userId: USER,
      email: EMAIL,
      fvaMinutes: 2,
    }));
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(200);
    expect(clerkClient.deleteUser).toHaveBeenCalledWith(USER);
  });
});
