import { env, SELF } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import {
  errorFromThrow,
  fetchWithTimeout,
  finalize,
  requestIdOf,
  withTimeout,
} from "./http";

type Body = Record<string, unknown>;
const jsonRes = (
  body: unknown,
  status: number,
  headers: Record<string, string> = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
const read = async (r: Response) => (await r.json()) as Body;

describe("finalize", () => {
  it("adds message + requestId to a JSON error and keeps its headers", async () => {
    const out = await finalize(
      jsonRes({ error: "unauthorized" }, 401, {
        "access-control-allow-origin": "*",
        "cache-control": "no-store",
      }),
      "rid-1",
    );
    expect(await read(out)).toEqual({
      error: "unauthorized",
      message: expect.any(String),
      requestId: "rid-1",
    });
    expect(out.headers.get("x-request-id")).toBe("rid-1");
    expect(out.headers.get("access-control-allow-origin")).toBe("*");
    expect(out.headers.get("cache-control")).toBe("no-store");
  });

  it("keeps a handler's own message", async () => {
    const out = await finalize(
      jsonRes({ error: "x", message: "custom" }, 400),
      "r",
    );
    expect((await read(out)).message).toBe("custom");
  });

  it("gives rate_limited Retry-After + RateLimit-Policy; too_many_attempts gets neither", async () => {
    const rl = await finalize(jsonRes({ error: "rate_limited" }, 429), "r");
    expect(rl.headers.get("retry-after")).toBe("60");
    expect(rl.headers.get("ratelimit-policy")).toBe("20;w=60");
    const cap = await finalize(
      jsonRes({ error: "too_many_attempts" }, 429),
      "r",
    );
    expect(cap.headers.get("retry-after")).toBeNull();
  });

  it("leaves non-JSON and success bodies untouched, only adding X-Request-Id", async () => {
    const text = await finalize(
      new Response("Not found", { status: 404 }),
      "r",
    );
    expect(await text.text()).toBe("Not found");
    expect(text.headers.get("x-request-id")).toBe("r");
    const ok = await finalize(jsonRes({ ok: true }, 200), "r");
    expect(await read(ok)).toEqual({ ok: true });
  });
});

describe("errorFromThrow", () => {
  it("maps a missing table/column to 503 schema_behind", async () => {
    const res = errorFromThrow(
      new Error("D1_ERROR: no such table: cron_runs: SQLITE_ERROR"),
      "r",
    );
    expect(res.status).toBe(503);
    expect((await read(res)).error).toBe("schema_behind");
  });

  it("maps anything else to 500 internal", async () => {
    const res = errorFromThrow(new Error("boom"), "r");
    expect(res.status).toBe(500);
    expect((await read(res)).error).toBe("internal");
  });
});

describe("requestIdOf", () => {
  it("uses cf-ray, else a uuid", () => {
    expect(
      requestIdOf(
        new Request("https://x", { headers: { "cf-ray": "abc-CDG" } }),
      ),
    ).toBe("abc-CDG");
    expect(requestIdOf(new Request("https://x"))).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe("timeouts", () => {
  it("fetchWithTimeout aborts a call that never answers", async () => {
    const spy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(
        (_input, init) =>
          new Promise((_resolve, reject) =>
            init?.signal?.addEventListener("abort", () =>
              reject(init.signal?.reason),
            ),
          ),
      );
    await expect(
      fetchWithTimeout("https://slow.test", {}, 20),
    ).rejects.toMatchObject({
      name: "TimeoutError",
    });
    spy.mockRestore();
  });

  it("withTimeout rejects a promise that never settles", async () => {
    await expect(
      withTimeout(new Promise(() => {}), 20, "clerk"),
    ).rejects.toThrow("clerk timed out");
  });
});

describe("the api's outer fetch", () => {
  it("every response carries X-Request-Id and errors carry requestId", async () => {
    const res = await SELF.fetch("https://api.test/v1/events", {
      method: "POST",
    });
    expect(res.status).toBe(401);
    const id = res.headers.get("x-request-id");
    expect(id).toBeTruthy();
    expect(await read(res)).toMatchObject({
      error: "unauthorized",
      requestId: id,
    });
  });

  it("a missing table becomes 503 schema_behind, not a raw 500", async () => {
    await env.AUDIT_DB.exec("DROP TABLE cron_runs");
    const res = await SELF.fetch("https://api.test/v1/cron/status", {
      headers: { authorization: "Bearer test-token" },
    });
    expect(res.status).toBe(503);
    expect((await read(res)).error).toBe("schema_behind");
  });
});
