import {
  createExecutionContext,
  env,
  SELF,
  waitOnExecutionContext,
} from "cloudflare:test";
import {
  fingerprintEmail,
  sha256Hex,
} from "@indiecrafts/packages-shared-security/crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import type { sendErasureTokenEmail } from "./email";
import { handleErasureRequest } from "./request";

const SALT = "test-fingerprint-salt";

// `env` from cloudflare:test only binds APP_API_TOKEN/DB — GDPR_FINGERPRINT_SALT and
// TURNSTILE_SECRET are per-test overrides, same pattern as clerk-profile-sync.test.ts.
function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    ...(env as unknown as Env),
    GDPR_FINGERPRINT_SALT: SALT,
    ...overrides,
  };
}

function postForm(body: Record<string, string>): Request {
  return new Request("https://example.com/v1/erasure/request", {
    method: "POST",
    body: new URLSearchParams(body),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /v1/erasure/request", () => {
  it("renders the request form (routed through the worker)", async () => {
    const res = await SELF.fetch("https://example.com/v1/erasure/request");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(await res.text()).toContain('action="/v1/erasure/request"');
  });
});

describe("POST /v1/erasure/request", () => {
  it("creates an erasure_requests row + emails a hashed token for a known email", async () => {
    const fp = await fingerprintEmail("known1@x.com", SALT);
    await env.AUDIT_DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
    )
      .bind("user_req_1", "known1@x.com", fp, new Date(0).toISOString())
      .run();

    const sendSpy = vi.fn<typeof sendErasureTokenEmail>(async () => {});
    // A real ExecutionContext exercises the actual ctx.waitUntil backgrounding
    // path (the fix for the found/not-found timing side-channel): the INSERT +
    // email now run AFTER the response is handed back, not before it.
    const ctx = createExecutionContext();
    const res = await handleErasureRequest(
      postForm({ email: "known1@x.com" }),
      testEnv(),
      ctx,
      sendSpy,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
    // Flush the backgrounded work before asserting on it.
    await waitOnExecutionContext(ctx);

    expect(sendSpy).toHaveBeenCalledOnce();
    const [, { to, confirmUrl }] = sendSpy.mock.calls[0];
    expect(to).toBe("known1@x.com");
    const token = new URL(confirmUrl).searchParams.get("token");
    expect(token).toBeTruthy();
    expect(confirmUrl).toBe(
      `https://example.com/v1/erasure/confirm?token=${token}`,
    );

    const row = await env.AUDIT_DB.prepare(
      "SELECT status, token_hash, token_expires_at, due_at, attempts, user_id, email_fingerprint FROM erasure_requests WHERE email_fingerprint = ?",
    )
      .bind(fp)
      .first<{
        status: string;
        token_hash: string;
        token_expires_at: string;
        due_at: string;
        attempts: number;
        user_id: string;
        email_fingerprint: string;
      }>();
    expect(row?.status).toBe("email_sent");
    expect(row?.token_hash).toBe(await sha256Hex(token!));
    expect(row?.token_hash).not.toBe(token); // never the plaintext token
    expect(row?.attempts).toBe(0);
    expect(row?.user_id).toBe("user_req_1");
    expect(row!.token_expires_at > new Date().toISOString()).toBe(true);
    expect(row!.due_at > row!.token_expires_at).toBe(true);
  });

  it("returns the same generic 200 and stores/sends nothing for an unknown email", async () => {
    const fp = await fingerprintEmail("unknown1@x.com", SALT);
    const sendSpy = vi.fn(async () => {});
    const res = await handleErasureRequest(
      postForm({ email: "unknown1@x.com" }),
      testEnv(),
      undefined,
      sendSpy,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
    expect(sendSpy).not.toHaveBeenCalled();

    const { results } = await env.AUDIT_DB.prepare(
      "SELECT id FROM erasure_requests WHERE email_fingerprint = ?",
    )
      .bind(fp)
      .all();
    expect(results.length).toBe(0);
  });

  it("targets the website when WEBSITE_URL is set", async () => {
    const fp = await fingerprintEmail("known3@x.com", SALT);
    await env.AUDIT_DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
    )
      .bind("user_req_3", "known3@x.com", fp, new Date(0).toISOString())
      .run();

    const sendSpy = vi.fn<typeof sendErasureTokenEmail>(async () => {});
    const ctx = createExecutionContext();
    const res = await handleErasureRequest(
      postForm({ email: "known3@x.com" }),
      testEnv({ WEBSITE_URL: "https://site.example" }),
      ctx,
      sendSpy,
    );
    expect(res.status).toBe(200);
    await waitOnExecutionContext(ctx);

    expect(sendSpy).toHaveBeenCalledOnce();
    const [, { confirmUrl }] = sendSpy.mock.calls[0];
    const token = new URL(confirmUrl).searchParams.get("token");
    expect(confirmUrl).toBe(
      `https://site.example/erasure/confirm?token=${token}`,
    );
  });

  it("falls back to the worker's own confirm form when WEBSITE_URL is unset", async () => {
    const fp = await fingerprintEmail("known4@x.com", SALT);
    await env.AUDIT_DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
    )
      .bind("user_req_4", "known4@x.com", fp, new Date(0).toISOString())
      .run();

    const sendSpy = vi.fn<typeof sendErasureTokenEmail>(async () => {});
    const ctx = createExecutionContext();
    const res = await handleErasureRequest(
      postForm({ email: "known4@x.com" }),
      testEnv(),
      ctx,
      sendSpy,
    );
    expect(res.status).toBe(200);
    await waitOnExecutionContext(ctx);

    expect(sendSpy).toHaveBeenCalledOnce();
    const [, { confirmUrl }] = sendSpy.mock.calls[0];
    expect(
      confirmUrl.startsWith("https://example.com/v1/erasure/confirm?token="),
    ).toBe(true);
  });

  it("rejects a bad Turnstile token when Turnstile is configured (no row, no email)", async () => {
    const fp = await fingerprintEmail("known2@x.com", SALT);
    await env.AUDIT_DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
    )
      .bind("user_req_2", "known2@x.com", fp, new Date(0).toISOString())
      .run();

    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          ({ ok: true, json: async () => ({ success: false }) }) as Response,
      ),
    );

    const sendSpy = vi.fn(async () => {});
    const res = await handleErasureRequest(
      postForm({ email: "known2@x.com", "cf-turnstile-response": "bad-token" }),
      testEnv({ TURNSTILE_SECRET: "test-secret" }),
      undefined,
      sendSpy,
    );
    expect(res.status).toBe(403);
    expect(sendSpy).not.toHaveBeenCalled();

    const { results } = await env.AUDIT_DB.prepare(
      "SELECT id FROM erasure_requests WHERE email_fingerprint = ?",
    )
      .bind(fp)
      .all();
    expect(results.length).toBe(0);
  });
});
