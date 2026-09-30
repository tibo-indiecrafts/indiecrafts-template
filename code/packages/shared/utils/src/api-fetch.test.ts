import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./api-fetch";

const res = (status: number, headers: Record<string, string> = {}) =>
  new Response("{}", { status, headers });
const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);
afterEach(() => fetchMock.mockReset());
const keyOf = (call: unknown[]) =>
  new Headers((call[1] as RequestInit).headers).get("idempotency-key");

describe("apiFetch", () => {
  it("retries a GET once after a 5xx and returns the second answer", async () => {
    fetchMock.mockResolvedValueOnce(res(503)).mockResolvedValueOnce(res(200));
    expect((await apiFetch("https://api.test/v1/x")).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("never retries a 4xx other than 429", async () => {
    fetchMock.mockResolvedValue(res(400));
    expect((await apiFetch("https://api.test/v1/x")).status).toBe(400);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not retry a POST unless it is marked idempotent (it could act twice)", async () => {
    fetchMock.mockResolvedValue(res(503));
    await apiFetch("https://api.test/v1/cron/run", { method: "POST" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(keyOf(fetchMock.mock.calls[0]!)).toBeNull();
  });

  it("retries an idempotent POST with the SAME Idempotency-Key", async () => {
    fetchMock.mockResolvedValueOnce(res(503)).mockResolvedValueOnce(res(201));
    const out = await apiFetch("https://api.test/v1/events", {
      method: "POST",
      body: "{}",
      idempotent: true,
    });
    expect(out.status).toBe(201);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const first = keyOf(fetchMock.mock.calls[0]!);
    expect(first).toMatch(/^[0-9a-f-]{36}$/);
    expect(keyOf(fetchMock.mock.calls[1]!)).toBe(first);
  });

  it("times out a call that never answers", async () => {
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) =>
          init.signal?.addEventListener("abort", () =>
            reject(init.signal?.reason),
          ),
        ),
    );
    await expect(
      apiFetch("https://api.test/v1/x", { method: "POST", timeoutMs: 20 }),
    ).rejects.toMatchObject({
      name: "TimeoutError",
    });
  });

  it("waits Retry-After (≤ 5 s) on a 429, then retries", async () => {
    fetchMock
      .mockResolvedValueOnce(res(429, { "retry-after": "1" }))
      .mockResolvedValueOnce(res(200));
    const t0 = Date.now();
    expect((await apiFetch("https://api.test/v1/x")).status).toBe(200);
    expect(Date.now() - t0).toBeGreaterThanOrEqual(950);
  });
});
