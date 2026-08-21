import { describe, expect, it, vi } from "vitest";
import { callAgent } from "./index";

// A fetch double returning a JSON body with a given status. Captures the call.
function fakeFetch(body: unknown, ok = true, status = 200) {
  return vi.fn(
    async (_url: string | URL | Request, _init?: RequestInit) =>
      ({ ok, status, json: async () => body }) as unknown as Response,
  );
}

const REQ = { context: "write ideas", locale: "fr" };
const WORKER = { urlPrefix: "https://api.example/v1/agent", token: "secret" };

describe("callAgent", () => {
  it("returns { ok: true, data } on a 200 with a data envelope", async () => {
    const fetch = fakeFetch({ data: { ideas: [1, 2] } });
    const res = await callAgent("content-research", REQ, { ...WORKER, fetch });
    expect(res).toEqual({ ok: true, data: { ideas: [1, 2] } });
  });

  it("composes `${urlPrefix}/${name}`, sends the bearer, and posts context + locale", async () => {
    const fetch = fakeFetch({ data: {} });
    await callAgent("content-research", REQ, { ...WORKER, fetch });
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("https://api.example/v1/agent/content-research");
    expect((init!.headers as Record<string, string>).authorization).toBe(
      "Bearer secret",
    );
    expect(JSON.parse(init!.body as string)).toEqual({
      context: "write ideas",
      locale: "fr",
    });
  });

  it("omits the authorization header and merges extraBody (the web route)", async () => {
    const fetch = fakeFetch({ data: {} });
    await callAgent(
      "content-research",
      { context: "x" },
      { urlPrefix: "/api/agent", extraBody: { "cf-turnstile-response": "t" }, fetch },
    );
    const [, init] = fetch.mock.calls[0];
    expect((init!.headers as Record<string, string>).authorization).toBeUndefined();
    expect(JSON.parse(init!.body as string)).toEqual({
      context: "x",
      "cf-turnstile-response": "t",
    });
  });

  it("guards an empty context without calling fetch", async () => {
    const fetch = fakeFetch({ data: {} });
    const res = await callAgent("content-research", { context: "  " }, { ...WORKER, fetch });
    expect(res.ok).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed on a missing urlPrefix", async () => {
    const fetch = fakeFetch({ data: {} });
    const res = await callAgent("content-research", REQ, { urlPrefix: "", fetch });
    expect(res.ok).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed on a non-200, surfacing the status", async () => {
    const fetch = fakeFetch({ error: "server" }, false, 502);
    const res = await callAgent("content-research", REQ, { ...WORKER, fetch });
    expect(res).toEqual({ ok: false, error: "agent 502" });
  });

  it("fails closed on a 200 with no data key (malformed)", async () => {
    const fetch = fakeFetch({ oops: true });
    const res = await callAgent("content-research", REQ, { ...WORKER, fetch });
    expect(res).toEqual({ ok: false, error: "malformed response" });
  });

  it("never throws on a network error", async () => {
    const fetch = vi.fn(async () => {
      throw new Error("network down");
    });
    const res = await callAgent("content-research", REQ, { ...WORKER, fetch });
    expect(res).toEqual({ ok: false, error: "network down" });
  });

  it("passes an abort signal so a hung request can time out", async () => {
    const fetch = fakeFetch({ data: {} });
    await callAgent("content-research", REQ, { ...WORKER, fetch });
    const [, init] = fetch.mock.calls[0];
    expect(init!.signal).toBeInstanceOf(AbortSignal);
  });
});
