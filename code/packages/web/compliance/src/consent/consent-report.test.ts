import { afterEach, describe, expect, it, vi } from "vitest";
import { consentEvents, reportConsent } from "./consent-report";
import { applyConsent } from "./consent-store";

describe("consentEvents", () => {
  it("maps optional categories to consent types, skipping necessary/unknown", () => {
    expect(
      consentEvents({
        necessary: true,
        analytics: true,
        marketing: false,
        bogus: true,
      }),
    ).toEqual([
      { type: "cookie_analytics", granted: true },
      { type: "cookie_marketing", granted: false },
    ]);
  });

  it("omits a category that is absent from choices", () => {
    expect(consentEvents({ analytics: true })).toEqual([
      { type: "cookie_analytics", granted: true },
    ]);
  });
});

describe("reportConsent", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("POSTs the mapped events with a decisionId to /api/consent-log", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-1" });

    reportConsent({ analytics: true, marketing: false }, "2026-01", "banner");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/consent-log");
    expect(JSON.parse(init.body as string)).toEqual({
      events: [
        { type: "cookie_analytics", granted: true },
        { type: "cookie_marketing", granted: false },
      ],
      version: "2026-01",
      source: "banner",
      decisionId: "uuid-1",
    });
  });
});

describe("applyConsent → reportConsent source threading", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("threads the auto-seed source through to the POST body", () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-2" });

    applyConsent([], { analytics: true }, "2026-01", "auto");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body as string)).toMatchObject({ source: "auto" });
  });

  it('defaults to source "banner" when no source is passed', () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-3" });

    applyConsent([], { analytics: true }, "2026-01");

    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body as string)).toMatchObject({ source: "banner" });
  });
});
