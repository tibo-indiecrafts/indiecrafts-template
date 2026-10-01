import { afterEach, describe, expect, it, vi } from "vitest";
import { sendDataRequestClosedEmail, sendDataRequestReceipt } from "./email";

const ON = { RESEND_API_KEY: "k", EMAIL_FROM: "no-reply@x.com" };
const none = async () => null;

afterEach(() => {
  vi.unstubAllGlobals();
});

function okFetch() {
  const f = vi.fn(
    async (_u: string, _i?: RequestInit) =>
      ({ ok: true, status: 200 }) as Response,
  );
  vi.stubGlobal("fetch", f);
  return f;
}

const sent = (f: ReturnType<typeof okFetch>) =>
  JSON.parse(f.mock.calls[0]![1]!.body as string) as {
    to: string;
    subject: string;
    html: string;
    text: string;
  };

const base = {
  to: "jane@example.com",
  id: 12,
  requestType: "access",
  submittedAt: "2026-10-01T08:30:00.000Z",
};

describe("sendDataRequestReceipt", () => {
  it("sends the English receipt with the right, the reference and the due date", async () => {
    const f = okFetch();
    expect(
      await sendDataRequestReceipt(ON, { ...base, locale: "en" }, none),
    ).toBe(true);
    const b = sent(f);
    expect(b.to).toBe("jane@example.com");
    expect(b.subject).toBe("We received your request (#12)");
    expect(b.text).toContain("access request (reference #12)");
    expect(b.text).toContain("1 November 2026");
  });

  it("sends French to a French requester", async () => {
    const f = okFetch();
    await sendDataRequestReceipt(ON, { ...base, locale: "fr" }, none);
    const b = sent(f);
    expect(b.subject).toBe("Nous avons bien reçu votre demande (n° 12)");
    expect(b.text).toContain("demande d'accès");
    expect(b.text).toContain("1 novembre 2026");
  });

  it("uses the Studio copy, with its placeholders filled", async () => {
    const f = okFetch();
    await sendDataRequestReceipt(ON, { ...base, locale: "en" }, async () => ({
      dataRequestReceipt: { subject: { en: "Ref {{id}} — {{right}}" } },
    }));
    expect(sent(f).subject).toBe("Ref 12 — access");
  });

  it("does not send when the mailer is unconfigured or Studio turns it off", async () => {
    const f = okFetch();
    expect(
      await sendDataRequestReceipt({}, { ...base, locale: "en" }, none),
    ).toBe(false);
    expect(
      await sendDataRequestReceipt(ON, { ...base, locale: "en" }, async () => ({
        dataRequestReceipt: { enabled: false },
      })),
    ).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });
});

describe("sendDataRequestClosedEmail", () => {
  it("sends the outcome and the escaped note, line breaks kept", async () => {
    const f = okFetch();
    await sendDataRequestClosedEmail(
      ON,
      {
        to: "j@x.com",
        id: 12,
        outcome: "rejected",
        note: "No.\n<script>x</script>",
        locale: "en",
      },
      none,
    );
    const b = sent(f);
    expect(b.subject).toBe("Your request #12 was declined");
    expect(b.html).toContain("No.<br>&lt;script&gt;");
    expect(b.html).not.toContain("<script>x");
    expect(b.text).toContain("No.\n<script>x</script>");
  });

  it("is French for a French requester", async () => {
    const f = okFetch();
    await sendDataRequestClosedEmail(
      ON,
      { to: "j@x.com", id: 12, outcome: "done", note: "Fait.", locale: "fr" },
      none,
    );
    expect(sent(f).subject).toBe("Votre demande n° 12 est traitée");
  });

  it("throws on a Resend error, so the caller reports notified: false", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500 }) as Response),
    );
    await expect(
      sendDataRequestClosedEmail(
        ON,
        { to: "j@x.com", id: 1, outcome: "done", note: "x", locale: "en" },
        none,
      ),
    ).rejects.toThrow("resend 500");
  });
});
