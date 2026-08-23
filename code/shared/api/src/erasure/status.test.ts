import { env } from "cloudflare:test";
import { sha256Hex } from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it } from "vitest";
import type { Env } from "../index";
import { handleErasureStatus } from "./status";

const USER = "user_status_1";
const FP = "fp-status-1";

async function seedRequest(overrides: {
  status?: string;
  completedAt?: string | null;
}): Promise<string> {
  const token = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO erasure_requests (status, token_hash, token_expires_at, attempts, user_id, email_fingerprint, requested_at, completed_at, due_at) VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?)",
  )
    .bind(
      overrides.status ?? "email_sent",
      await sha256Hex(token),
      new Date(now + 60_000).toISOString(),
      USER,
      FP,
      new Date(now).toISOString(),
      overrides.completedAt ?? null,
      new Date(now + 1000).toISOString(),
    )
    .run();
  return token;
}

function statusRequest(token: string): Request {
  return new Request(`https://example.com/v1/erasure/status/${token}`);
}

describe("GET /v1/erasure/status/:token", () => {
  it("returns only status/requested_at/due_at/completed_at — no PII", async () => {
    const token = await seedRequest({ status: "completed", completedAt: null });

    const res = await handleErasureStatus(
      statusRequest(token),
      env as unknown as Env,
      token,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;

    expect(body.status).toBe("completed");
    expect(body).toHaveProperty("requested_at");
    expect(body).toHaveProperty("due_at");
    expect(body).toHaveProperty("completed_at");

    expect(body).not.toHaveProperty("email_fingerprint");
    expect(body).not.toHaveProperty("user_id");
    expect(body).not.toHaveProperty("token_hash");
    expect(body).not.toHaveProperty("result");
  });

  it("returns 404 for an unknown token", async () => {
    const res = await handleErasureStatus(
      statusRequest("does-not-exist"),
      env as unknown as Env,
      "does-not-exist",
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found" });
  });

  it("returns 404 for an empty token and does not throw", async () => {
    const res = await handleErasureStatus(
      statusRequest(""),
      env as unknown as Env,
      "",
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found" });
  });
});
