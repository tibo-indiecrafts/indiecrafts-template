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
    // Present so the defaultAdapters secret preflight passes when the real
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

async function seedProfile(): Promise<string> {
  const fp = await fingerprintEmail(EMAIL, SALT);
  await env.DB.prepare(
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
    createCoreErasureAdapter(e.CORE_DB!, SALT),
    createAuditErasureAdapter(e.DB!, e.CORE_DB!, SALT),
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
    const row = await env.DB.prepare(
      "SELECT status FROM erasure_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ status: string }>();
    expect(row?.status).toBe("completed");
    // A completion audit row was written.
    const audit = await env.DB.prepare(
      "SELECT event FROM admin_audit WHERE target_user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ event: string }>();
    expect(audit?.event).toBe("erasure.self");
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
    // No 4th arg → defaultAdapters; env missing CLERK_SECRET_KEY.
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv({ CLERK_SECRET_KEY: undefined }),
      undefined,
      undefined,
      authenticate,
    );
    expect(res.status).toBe(503);
  });

  it("returns 207 partial when a store fails", async () => {
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
      createCoreErasureAdapter(e.CORE_DB!, SALT),
      createAuditErasureAdapter(e.DB!, e.CORE_DB!, SALT),
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
    expect(res.status).toBe(207);
    const row = await env.DB.prepare(
      "SELECT status, completed_at FROM erasure_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ status: string; completed_at: string | null }>();
    expect(row?.status).toBe("confirmed");
    // A partial run is not "completed" — the completion timestamp stays null.
    expect(row?.completed_at).toBeNull();
    // The accountability trail is still written on the partial path.
    const audit = await env.DB.prepare(
      "SELECT event FROM admin_audit WHERE target_user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ event: string }>();
    expect(audit?.event).toBe("erasure.self");
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
