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

  it("includes bcc in the Resend POST body when EMAIL_ADMIN_BCC is set", async () => {
    const fetchMock = okFetch();
    await sendErasureTokenEmail(
      { ...CONFIGURED, EMAIL_ADMIN_BCC: "admin@x.com" },
      { to: "user@x.com", confirmUrl: "https://x.com/confirm" },
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody & {
      bcc?: string[];
    };
    expect(body.bcc).toEqual(["admin@x.com"]);
  });

  it("omits bcc when EMAIL_ADMIN_BCC is unset", async () => {
    const fetchMock = okFetch();
    await sendErasureTokenEmail(CONFIGURED, {
      to: "user@x.com",
      confirmUrl: "https://x.com/confirm",
    });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody & {
      bcc?: string[];
    };
    expect(body.bcc).toBeUndefined();
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

  it("falls back to the hard-coded English literals, byte-identical, when the Sanity fetch resolves null", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => null);
    await sendErasureTokenEmail(
      CONFIGURED,
      { to: "user@x.com", confirmUrl: "https://x.com/confirm" },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.subject).toBe("Confirm your data erasure request");
    expect(body.html).toBe(
      '<p>Hello user@x.com,</p><p>We received a request to erase your account data.</p><p><a href="https://x.com/confirm">Confirm erasure</a></p><p>This link expires in 24 hours. If you did not request this, ignore this email.</p>',
    );
    expect(body.text).toBe(
      "Hello user@x.com,\n\nWe received a request to erase your account data. Confirm it here:\nhttps://x.com/confirm\n\nThis link expires in 24 hours. If you did not request this, ignore this email.",
    );
  });

  it("falls back to the hard-coded English literals when the Sanity fetch throws", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => {
      throw new Error("network down");
    });
    await sendErasureTokenEmail(
      CONFIGURED,
      { to: "user@x.com", confirmUrl: "https://x.com/confirm" },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.subject).toBe("Confirm your data erasure request");
  });

  it("uses the Sanity copy when the fetch resolves a group", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => ({
      erasureToken: {
        subject: { en: "Your erasure link", fr: "Votre lien" },
        heading: "Custom heading copy.",
        buttonLabel: "Click to confirm",
        outro: "Custom outro.",
      },
    }));
    await sendErasureTokenEmail(
      CONFIGURED,
      { to: "user@x.com", confirmUrl: "https://x.com/confirm" },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.subject).toBe("Your erasure link");
    expect(body.html).toContain("Custom heading copy.");
    expect(body.html).toContain(">Click to confirm<");
    expect(body.html).toContain("Custom outro.");
  });

  it("appends the editable support-address footer when one is set", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => ({
      supportEmail: "support@x.com",
    }));
    await sendErasureTokenEmail(
      CONFIGURED,
      { to: "user@x.com", confirmUrl: "https://x.com/confirm" },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.html).toContain("mailto:support@x.com");
    expect(body.text).toContain("support@x.com");
  });

  it("resolves the Sanity copy in the recipient's locale, else the default", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => ({
      erasureToken: {
        subject: { en: "Erase your data", fr: "Effacer vos données" },
        // fr-only heading — no en/default; must fall through per field.
        heading: { fr: "Titre FR" },
      },
    }));
    await sendErasureTokenEmail(
      CONFIGURED,
      { to: "user@x.com", confirmUrl: "https://x.com/confirm", locale: "fr" },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.subject).toBe("Effacer vos données");
    expect(body.html).toContain("Titre FR");
  });

  it("enabled: false still sends the email, using the hard-coded literals", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => ({
      erasureToken: { enabled: false, subject: "Should not be used" },
    }));
    await sendErasureTokenEmail(
      CONFIGURED,
      { to: "user@x.com", confirmUrl: "https://x.com/confirm" },
      fetchStrings,
    );
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.subject).toBe("Confirm your data erasure request");
  });

  it("escapes the Sanity copy and the confirmUrl together", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => ({
      erasureToken: { heading: 'A "quoted" & <tagged> heading.' },
    }));
    await sendErasureTokenEmail(
      CONFIGURED,
      {
        to: "user@x.com",
        confirmUrl: "https://x.com/confirm?a=1&b=2",
      },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.html).not.toContain("<tagged>");
    expect(body.html).toContain("&lt;tagged&gt;");
    expect(body.html).toContain("&quot;quoted&quot;");
    expect(body.html).not.toContain("confirm?a=1&b=2");
    expect(body.html).toContain("confirm?a=1&amp;b=2");
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

  it("falls back to the hard-coded English literals, byte-identical, when the Sanity fetch resolves null", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => null);
    await sendErasureCompleteEmail(
      CONFIGURED,
      { to: "user@x.com", retained: "Kept nothing." },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.subject).toBe("Your data erasure is complete");
    expect(body.html).toBe(
      "<p>Hello user@x.com,</p><p>We erased your account data.</p><p>Kept nothing.</p>",
    );
    expect(body.text).toBe(
      "Hello user@x.com,\n\nWe erased your account data.\n\nKept nothing.",
    );
  });

  it("uses the Sanity copy when the fetch resolves a group", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => ({
      erasureComplete: {
        subject: "All done",
        heading: "Custom complete heading.",
        outro: "Custom outro.",
      },
    }));
    await sendErasureCompleteEmail(
      CONFIGURED,
      { to: "user@x.com", retained: "nothing" },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.subject).toBe("All done");
    expect(body.html).toContain("Custom complete heading.");
    expect(body.html).toContain("Custom outro.");
  });

  it("appends the editable support-address footer when one is set", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => ({
      supportEmail: "support@x.com",
    }));
    await sendErasureCompleteEmail(
      CONFIGURED,
      { to: "user@x.com", retained: "nothing" },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.html).toContain("mailto:support@x.com");
    expect(body.text).toContain("support@x.com");
  });

  it("enabled: false still sends the email, using the hard-coded literals", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => ({
      erasureComplete: { enabled: false, subject: "Should not be used" },
    }));
    await sendErasureCompleteEmail(
      CONFIGURED,
      { to: "user@x.com", retained: "nothing" },
      fetchStrings,
    );
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.subject).toBe("Your data erasure is complete");
  });

  it("escapes the Sanity copy and the retained summary together", async () => {
    const fetchMock = okFetch();
    const fetchStrings = vi.fn(async () => ({
      erasureComplete: { outro: 'Some "quoted" & <tagged> outro.' },
    }));
    await sendErasureCompleteEmail(
      CONFIGURED,
      { to: "user@x.com", retained: 'Kept the <admin_audit> log & "billing".' },
      fetchStrings,
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as ResendBody;
    expect(body.html).not.toContain("<tagged>");
    expect(body.html).toContain("&lt;tagged&gt;");
    expect(body.html).not.toContain("<admin_audit>");
    expect(body.html).toContain("&lt;admin_audit&gt;");
  });
});
