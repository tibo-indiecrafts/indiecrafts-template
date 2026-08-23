import { afterEach, describe, expect, it, vi } from "vitest";
import { sendErasureCompleteEmail, sendErasureTokenEmail } from "./email";

const CONFIGURED = { RESEND_API_KEY: "test_key", EMAIL_FROM: "no-reply@x.com" };

afterEach(() => {
  vi.unstubAllGlobals();
});

type ResendBody = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

function okFetch() {
  const fetchMock = vi.fn(
    async (_url: string, _init?: RequestInit) =>
      ({ ok: true, status: 200 }) as Response,
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("sendErasureTokenEmail", () => {
  it("POSTs the Resend API with the confirmUrl, escaped in the HTML body", async () => {
    const fetchMock = okFetch();
    await sendErasureTokenEmail(CONFIGURED, {
      to: "user@x.com",
      confirmUrl: "https://x.com/v1/erasure/confirm?token=abc&x=1",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers).toMatchObject({
      Authorization: "Bearer test_key",
      "content-type": "application/json",
    });
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.from).toBe("no-reply@x.com");
    expect(body.to).toBe("user@x.com");
    expect(typeof body.subject).toBe("string");
    expect(body.subject.length).toBeGreaterThan(0);
    // The raw `&` must not appear unescaped in the HTML.
    expect(body.html).not.toContain(
      "https://x.com/v1/erasure/confirm?token=abc&x=1",
    );
    expect(body.html).toContain(
      "https://x.com/v1/erasure/confirm?token=abc&amp;x=1",
    );
  });

  it("no-ops (never calls fetch) when RESEND_API_KEY is unset", async () => {
    const fetchMock = okFetch();
    await sendErasureTokenEmail(
      { RESEND_API_KEY: undefined, EMAIL_FROM: "no-reply@x.com" },
      { to: "user@x.com", confirmUrl: "https://x.com/confirm" },
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("no-ops (never calls fetch) when EMAIL_FROM is unset", async () => {
    const fetchMock = okFetch();
    await sendErasureTokenEmail(
      { RESEND_API_KEY: "test_key", EMAIL_FROM: undefined },
      { to: "user@x.com", confirmUrl: "https://x.com/confirm" },
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws when Resend responds non-ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500 }) as Response),
    );
    await expect(
      sendErasureTokenEmail(CONFIGURED, {
        to: "user@x.com",
        confirmUrl: "https://x.com/confirm",
      }),
    ).rejects.toThrow("resend 500");
  });
});

describe("sendErasureCompleteEmail", () => {
  it("POSTs the Resend API with the retained summary, escaped in the HTML body", async () => {
    const fetchMock = okFetch();
    await sendErasureCompleteEmail(CONFIGURED, {
      to: "user@x.com",
      retained: 'Kept the <admin_audit> log & "billing" records.',
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.to).toBe("user@x.com");
    expect(body.html).not.toContain("<admin_audit>");
    expect(body.html).toContain("&lt;admin_audit&gt;");
    expect(body.html).toContain("&amp;");
  });

  it("no-ops (never calls fetch) when unconfigured", async () => {
    const fetchMock = okFetch();
    await sendErasureCompleteEmail(
      { RESEND_API_KEY: undefined, EMAIL_FROM: undefined },
      { to: "user@x.com", retained: "nothing" },
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
