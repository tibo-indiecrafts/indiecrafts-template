import { afterEach, describe, expect, it, vi } from "vitest";
import {
  mapExportResponse,
  rawExportFetch,
  requestExport,
} from "./export-self";

const base = {
  apiUrl: "https://api.example.test",
  getToken: async () => "tkn",
};

function stubFetch(status: number, body: unknown = {}) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));
}

afterEach(() => vi.restoreAllMocks());

describe("requestExport", () => {
  it("POSTs to /v1/export with a bearer token, 200 + downloadUrl → { ok: true, url }", async () => {
    const spy = stubFetch(200, { downloadUrl: "https://dl.example.test/x" });
    const r = await requestExport(base);
    expect(r).toEqual({ ok: true, url: "https://dl.example.test/x" });
    const [url, init] = spy.mock.calls[0]!;
    expect(url).toBe("https://api.example.test/v1/export");
    expect((init as RequestInit).method).toBe("POST");
    expect((init as RequestInit).headers).toMatchObject({
      authorization: "Bearer tkn",
    });
    // The export runs cross-origin from the browser: an Idempotency-Key header would fail the
    // CORS preflight, and the api never stores an export answer (it holds a live download link).
    expect(
      (init as { headers: Record<string, string> }).headers["idempotency-key"],
    ).toBeUndefined();
  });
  it("200 without downloadUrl → { ok: false }", async () => {
    stubFetch(200, {});
    expect(await requestExport(base)).toEqual({ ok: false });
  });
  it("401 → { ok: false }", async () => {
    stubFetch(401, { error: "unauthorized" });
    expect(await requestExport(base)).toEqual({ ok: false });
  });
  it("500 → { ok: false }", async () => {
    stubFetch(500, { error: "server" });
    expect(await requestExport(base)).toEqual({ ok: false });
  });
  it("network throw → { ok: false }", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    expect(await requestExport(base)).toEqual({ ok: false });
  });
});

// Step-up: the api answers 403 with Clerk's reverification hint when the session's last
// verification is too old. The raw call hands that body back so the surface's
// `useReverification` opens the prompt and retries — instead of a dead "Something went wrong".
describe("rawExportFetch + mapExportResponse", () => {
  it("hands Clerk's reverification hint back on a 403", async () => {
    const hint = {
      clerk_error: { type: "forbidden_error", reason: "reverification-error" },
    };
    stubFetch(403, hint);
    expect(await rawExportFetch(base)).toEqual(hint);
  });

  it("a 403 without the hint is a plain failure", async () => {
    stubFetch(403, { error: "forbidden" });
    expect(mapExportResponse(await rawExportFetch(base))).toEqual({
      ok: false,
    });
  });

  it("a 200 maps to the download url", async () => {
    stubFetch(200, { downloadUrl: "https://dl.example.test/x" });
    expect(mapExportResponse(await rawExportFetch(base))).toEqual({
      ok: true,
      url: "https://dl.example.test/x",
    });
  });
});
