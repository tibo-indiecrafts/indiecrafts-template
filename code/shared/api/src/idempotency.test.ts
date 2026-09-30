import { env, SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type { Env } from "./index";
import { withIdempotency } from "./idempotency";

const auth = {
  authorization: "Bearer test-token",
  "content-type": "application/json",
};
const event = (name: string) =>
  JSON.stringify({
    kind: "admin",
    event: name,
    actorUserId: "a",
    targetUserId: "b",
  });
const post = (body: string, headers: Record<string, string> = {}) =>
  SELF.fetch("https://api.test/v1/events", {
    method: "POST",
    headers: { ...auth, ...headers },
    body,
  });
const rows = async (name: string) =>
  (
    await env.AUDIT_DB.prepare(
      "SELECT COUNT(*) AS n FROM admin_audit WHERE event = ?",
    )
      .bind(name)
      .first<{ n: number }>()
  )?.n;

describe("Idempotency-Key on POST /v1/events", () => {
  it("replays the stored answer for a retry with the same key — one row, not two", async () => {
    const first = await post(event("qa.idem.1"), { "idempotency-key": "k-1" });
    const second = await post(event("qa.idem.1"), { "idempotency-key": "k-1" });
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(second.headers.get("idempotent-replayed")).toBe("true");
    expect(await rows("qa.idem.1")).toBe(1);
  });

  it("refuses the same key with a different body (422)", async () => {
    await post(event("qa.idem.2a"), { "idempotency-key": "k-2" });
    const res = await post(event("qa.idem.2b"), { "idempotency-key": "k-2" });
    expect(res.status).toBe(422);
    expect(((await res.json()) as { error: string }).error).toBe(
      "idempotency_key_reused",
    );
  });

  it("never replays across callers — another authorization is another scope", async () => {
    await post(event("qa.idem.3"), { "idempotency-key": "k-3" });
    const other = await SELF.fetch("https://api.test/v1/events", {
      method: "POST",
      headers: {
        authorization: "Bearer someone-else",
        "content-type": "application/json",
        "idempotency-key": "k-3",
      },
      body: event("qa.idem.3"),
    });
    expect(other.status).toBe(401); // the handler's own answer, not a replayed 201
    expect(other.headers.get("idempotent-replayed")).toBeNull();
  });

  it("rejects an invalid key (400)", async () => {
    const res = await post(event("qa.idem.4"), {
      "idempotency-key": "x".repeat(300),
    });
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toBe(
      "invalid_idempotency_key",
    );
  });

  it("answers 409 while the first request with that key still runs", async () => {
    const body = event("qa.idem.5");
    const res0 = await post(body, { "idempotency-key": "k-5" }); // stores a row
    expect(res0.status).toBe(201);
    await env.AUDIT_DB.prepare(
      "UPDATE idempotency_keys SET status = NULL WHERE key = 'k-5'",
    ).run();
    const res = await post(body, { "idempotency-key": "k-5" });
    expect(res.status).toBe(409);
  });

  it("does not store a 5xx — a retry runs the handler again", async () => {
    const req = () =>
      new Request("https://api.test/v1/events", {
        method: "POST",
        headers: { ...auth, "idempotency-key": "k-6" },
        body: "{}",
      });
    const failed = await withIdempotency(
      req(),
      env as unknown as Env,
      async () => new Response("x", { status: 500 }),
    );
    expect(failed.status).toBe(500);
    const retried = await withIdempotency(
      req(),
      env as unknown as Env,
      async () => new Response("{}", { status: 201 }),
    );
    expect(retried.status).toBe(201);
    expect(retried.headers.get("idempotent-replayed")).toBeNull();
  });

  it("without a key, every request runs (two rows)", async () => {
    await post(event("qa.idem.7"));
    await post(event("qa.idem.7"));
    expect(await rows("qa.idem.7")).toBe(2);
  });
});
