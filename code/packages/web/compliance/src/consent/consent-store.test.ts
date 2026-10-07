import { afterEach, describe, expect, it, vi } from "vitest";
import { applyConsent, signalsDeny } from "./consent-store";
import { CONSENT_COOKIE } from "./consent-cookie";

describe("signalsDeny", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("denies when the server-detected Sec-GPC signal is true, even with no client signal", () => {
    vi.stubGlobal("navigator", {
      globalPrivacyControl: false,
      doNotTrack: "0",
    });
    expect(signalsDeny(true)).toBe(true);
  });

  it("falls back to the client browser signal when the server signal is false", () => {
    vi.stubGlobal("navigator", { globalPrivacyControl: true, doNotTrack: "0" });
    expect(signalsDeny(false)).toBe(true);
  });

  it("denies nothing when neither the server nor the client signals opt-out", () => {
    vi.stubGlobal("navigator", {
      globalPrivacyControl: false,
      doNotTrack: "0",
    });
    expect(signalsDeny(false)).toBe(false);
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

describe("applyConsent → Consent Mode", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    delete window.dataLayer;
  });

  it("pushes the update as gtag's arguments object (gtag.js ignores a plain array)", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    applyConsent(
      [
        {
          key: "analytics",
          title: "Analytics",
          signals: ["analytics_storage"],
        },
      ],
      { analytics: true },
      "v1",
    );
    const entry = window.dataLayer!.at(-1);
    expect(Object.prototype.toString.call(entry)).toBe("[object Arguments]");
    expect(Array.from(entry as ArrayLike<unknown>).slice(0, 2)).toEqual([
      "consent",
      "update",
    ]);
    expect(
      (Array.from(entry as ArrayLike<unknown>)[2] as Record<string, string>)
        .analytics_storage,
    ).toBe("granted");
  });
});

describe("applyConsent → consent cookie", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("mirrors the decided version (never the choices) into a cookie the server can read", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-4" });

    applyConsent([], { analytics: true }, "2026-02");

    expect(document.cookie).toContain(`${CONSENT_COOKIE}=2026-02`);
    expect(document.cookie).not.toContain("analytics");
  });
});
