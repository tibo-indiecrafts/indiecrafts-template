import { afterEach, describe, expect, it, vi } from "vitest";
import { createRealSanityClient } from "./sanity-client";

const cfg = {
  projectId: "proj1",
  dataset: "production",
  apiVersion: "2025-01-01",
  writeToken: "write-token",
  readToken: "read-token",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body };
}

describe("createRealSanityClient", () => {
  it("findByEmail GETs the GROQ query URL with the read token and returns the result", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      jsonResponse({ result: [{ _id: "sub1" }] }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = createRealSanityClient(cfg);
    const docs = await client.findByEmail("waitlistEntry", "X@Y.com");
    expect(docs).toEqual([{ _id: "sub1" }]);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      `https://${cfg.projectId}.api.sanity.io/v${cfg.apiVersion}/data/query/${cfg.dataset}` +
        `?query=${encodeURIComponent("*[_type == $type && email == $email]{ _id }")}` +
        `&$type=${encodeURIComponent(JSON.stringify("waitlistEntry"))}` +
        `&$email=${encodeURIComponent(JSON.stringify("x@y.com"))}`,
    );
    expect(init.headers).toEqual({ authorization: `Bearer ${cfg.readToken}` });
  });

  it("findByEmail sends no auth header when readToken is unset", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      jsonResponse({}),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = createRealSanityClient({ ...cfg, readToken: undefined });
    const docs = await client.findByEmail("waitlistEntry", "x@y.com");
    expect(docs).toEqual([]);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toEqual({});
  });

  it("findByEmail throws on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({}, false, 500)),
    );
    const client = createRealSanityClient(cfg);
    await expect(
      client.findByEmail("waitlistEntry", "x@y.com"),
    ).rejects.toThrow("sanity query 500");
  });

  it("pseudonymise POSTs /data/mutate with the patch mutation and the write token", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      jsonResponse({}),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = createRealSanityClient(cfg);
    await client.pseudonymise("sub1", { email: "fp", erased: true });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      `https://${cfg.projectId}.api.sanity.io/v${cfg.apiVersion}/data/mutate/${cfg.dataset}`,
    );
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      authorization: `Bearer ${cfg.writeToken}`,
      "content-type": "application/json",
    });
    expect(JSON.parse(init.body as string)).toEqual({
      mutations: [
        { patch: { id: "sub1", set: { email: "fp", erased: true } } },
      ],
    });
  });

  it("pseudonymise throws on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({}, false, 400)),
    );
    const client = createRealSanityClient(cfg);
    await expect(client.pseudonymise("sub1", {})).rejects.toThrow(
      "sanity mutate 400",
    );
  });
});
