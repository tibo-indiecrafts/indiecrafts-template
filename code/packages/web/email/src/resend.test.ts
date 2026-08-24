import { afterEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "./resend";

const OK = { ok: true, status: 200, text: async () => "" } as Response;
const bodyOf = (m: ReturnType<typeof vi.fn>) =>
  JSON.parse((m.mock.calls[0]![1] as RequestInit).body as string);

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_ADMIN_BCC;
});

describe("sendEmail", () => {
  it("throws when RESEND_API_KEY is unset", async () => {
    delete process.env.RESEND_API_KEY;
    await expect(
      sendEmail({ from: "a@x.com", to: ["b@x.com"], subject: "s", text: "t" }),
    ).rejects.toThrow("RESEND_API_KEY");
  });

  it("posts to the Resend API and omits cc/bcc/reply_to when empty", async () => {
    process.env.RESEND_API_KEY = "test_key";
    const fetchMock = vi.fn(async () => OK);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({
      from: "a@x.com",
      to: ["b@x.com"],
      subject: "s",
      text: "t",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]![0]).toBe("https://api.resend.com/emails");
    const body = bodyOf(fetchMock);
    expect(body).toMatchObject({
      from: "a@x.com",
      to: ["b@x.com"],
      subject: "s",
      text: "t",
    });
    expect(body).not.toHaveProperty("cc");
    expect(body).not.toHaveProperty("bcc");
    expect(body).not.toHaveProperty("reply_to");
  });

  it("includes cc/bcc/reply_to and html when provided", async () => {
    process.env.RESEND_API_KEY = "k";
    const fetchMock = vi.fn(async () => OK);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({
      from: "a@x.com",
      to: ["b@x.com"],
      cc: ["c@x.com"],
      bcc: ["d@x.com"],
      replyTo: "r@x.com",
      subject: "s",
      text: "t",
      html: "<b>t</b>",
    });

    expect(bodyOf(fetchMock)).toMatchObject({
      cc: ["c@x.com"],
      bcc: ["d@x.com"],
      reply_to: "r@x.com",
      html: "<b>t</b>",
    });
  });

  it("unions EMAIL_ADMIN_BCC with a distinct caller-supplied bcc", async () => {
    process.env.RESEND_API_KEY = "k";
    process.env.EMAIL_ADMIN_BCC = "admin@x.com";
    const fetchMock = vi.fn(async () => OK);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({
      from: "a@x.com",
      to: ["b@x.com"],
      bcc: ["d@x.com"], // distinct from the admin address → union adds it
      subject: "s",
      text: "t",
    });

    expect(bodyOf(fetchMock).bcc).toEqual(["d@x.com", "admin@x.com"]);
  });

  it("dedupes EMAIL_ADMIN_BCC when the caller already listed it", async () => {
    process.env.RESEND_API_KEY = "k";
    process.env.EMAIL_ADMIN_BCC = "admin@x.com";
    const fetchMock = vi.fn(async () => OK);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({
      from: "a@x.com",
      to: ["b@x.com"],
      bcc: ["admin@x.com"],
      subject: "s",
      text: "t",
    });

    expect(bodyOf(fetchMock).bcc).toEqual(["admin@x.com"]);
  });

  it("adds EMAIL_ADMIN_BCC as the sole bcc when the caller passed none", async () => {
    process.env.RESEND_API_KEY = "k";
    process.env.EMAIL_ADMIN_BCC = "admin@x.com";
    const fetchMock = vi.fn(async () => OK);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({
      from: "a@x.com",
      to: ["b@x.com"],
      subject: "s",
      text: "t",
    });

    expect(bodyOf(fetchMock).bcc).toEqual(["admin@x.com"]);
  });

  it("omits bcc when EMAIL_ADMIN_BCC is unset and the caller passed none", async () => {
    process.env.RESEND_API_KEY = "k";
    const fetchMock = vi.fn(async () => OK);
    vi.stubGlobal("fetch", fetchMock);

    await sendEmail({
      from: "a@x.com",
      to: ["b@x.com"],
      subject: "s",
      text: "t",
    });

    expect(bodyOf(fetchMock)).not.toHaveProperty("bcc");
  });

  it("throws with the status on a non-2xx response", async () => {
    process.env.RESEND_API_KEY = "k";
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          ({ ok: false, status: 422, text: async () => "bad" }) as Response,
      ),
    );
    await expect(
      sendEmail({ from: "a@x.com", to: ["b@x.com"], subject: "s", text: "t" }),
    ).rejects.toThrow("resend responded 422");
  });
});
