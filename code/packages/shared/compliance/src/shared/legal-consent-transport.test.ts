import { describe, it, expect, vi, afterEach } from "vitest";
import {
  fetchLegalVersion,
  readLegalConsent,
  writeLegalConsent,
} from "./legal";

function mockFetch(impl: (url: string, init?: RequestInit) => Response) {
  const spy = vi.fn((url: string, init?: RequestInit) =>
    Promise.resolve(impl(url, init)),
  );
  vi.stubGlobal("fetch", spy);
  return spy;
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

afterEach(() => vi.unstubAllGlobals());

describe("fetchLegalVersion", () => {
  it("returns the version and strips the trailing slash from the base URL", async () => {
    const spy = mockFetch(() => json({ version: "v1·2026-01" }));
    expect(await fetchLegalVersion("https://site.test/")).toBe("v1·2026-01");
    expect(spy).toHaveBeenCalledWith("https://site.test/api/legal-version");
  });

  it("returns null for an empty base URL, a non-200, or a throw", async () => {
    expect(await fetchLegalVersion("")).toBeNull();
    mockFetch(() => json({}, 500));
    expect(await fetchLegalVersion("https://site.test")).toBeNull();
    mockFetch(() => {
      throw new Error("offline");
    });
    expect(await fetchLegalVersion("https://site.test")).toBeNull();
  });
});

describe("readLegalConsent", () => {
  const getToken = async () => "jwt";

  it("returns the server-recorded version, sending the bearer token", async () => {
    const spy = mockFetch(() => json({ legal_acked_version: "v1" }));
    expect(
      await readLegalConsent({ apiUrl: "https://api.test", getToken }),
    ).toBe("v1");
    expect(spy).toHaveBeenCalledWith("https://api.test/v1/consent/legal", {
      headers: { authorization: "Bearer jwt" },
    });
  });

  it("returns null without an api URL, without a token, or on a non-200", async () => {
    expect(await readLegalConsent({ apiUrl: "", getToken })).toBeNull();
    expect(
      await readLegalConsent({
        apiUrl: "https://api.test",
        getToken: async () => null,
      }),
    ).toBeNull();
    mockFetch(() => json({ error: "unauthorized" }, 401));
    expect(
      await readLegalConsent({ apiUrl: "https://api.test", getToken }),
    ).toBeNull();
  });
});

describe("writeLegalConsent", () => {
  const getToken = async () => "jwt";

  it("POSTs the version + surface and returns true on 200", async () => {
    const spy = mockFetch(() => json({ ok: true }));
    const ok = await writeLegalConsent({
      apiUrl: "https://api.test",
      getToken,
      version: "v1",
      surface: "app",
    });
    expect(ok).toBe(true);
    const [, init] = spy.mock.calls[0]!;
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({
      version: "v1",
      surface: "app",
    });
  });

  it("returns false without a token or on a non-200 (never throws)", async () => {
    expect(
      await writeLegalConsent({
        apiUrl: "https://api.test",
        getToken: async () => null,
        version: "v1",
        surface: "app",
      }),
    ).toBe(false);
    mockFetch(() => json({ error: "rate_limited" }, 429));
    expect(
      await writeLegalConsent({
        apiUrl: "https://api.test",
        getToken,
        version: "v1",
        surface: "app",
      }),
    ).toBe(false);
  });
});
