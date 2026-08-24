import { afterEach, describe, expect, it, vi } from "vitest";
import { sendSecurityAlertEmail } from "./alert";

const ALERT = {
  eventType: "data_exfiltration",
  severity: "critical",
  surface: "app",
  userId: "user_1",
  country: "FR",
  description: "bulk export",
  ts: "2026-08-24T10:00:00.000Z",
} as const;

afterEach(() => vi.unstubAllGlobals());

type AlertBody = { to: string; subject: string; text: string };

function okFetch() {
  const m = vi.fn(
    async (_url: string, _init?: RequestInit) =>
      ({ ok: true, status: 200 }) as Response,
  );
  vi.stubGlobal("fetch", m);
  return m;
}

describe("sendSecurityAlertEmail", () => {
  it("POSTs Resend to SECURITY_ALERT_EMAIL when set", async () => {
    const m = okFetch();
    await sendSecurityAlertEmail(
      {
        RESEND_API_KEY: "k",
        EMAIL_FROM: "no-reply@x.com",
        SECURITY_ALERT_EMAIL: "soc@x.com",
      },
      ALERT,
    );
    expect(m).toHaveBeenCalledOnce();
    const [, init] = m.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as AlertBody;
    expect(body.to).toBe("soc@x.com");
    expect(body.subject).toContain("data_exfiltration");
  });

  it("falls back to EMAIL_ADMIN_BCC when SECURITY_ALERT_EMAIL is unset", async () => {
    const m = okFetch();
    await sendSecurityAlertEmail(
      {
        RESEND_API_KEY: "k",
        EMAIL_FROM: "no-reply@x.com",
        EMAIL_ADMIN_BCC: "admin@x.com",
      },
      ALERT,
    );
    const [, init] = m.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as AlertBody;
    expect(body.to).toBe("admin@x.com");
  });

  it("no-ops when RESEND_API_KEY is unset", async () => {
    const m = okFetch();
    await sendSecurityAlertEmail({ SECURITY_ALERT_EMAIL: "soc@x.com" }, ALERT);
    expect(m).not.toHaveBeenCalled();
  });

  it("no-ops when no recipient resolves", async () => {
    const m = okFetch();
    await sendSecurityAlertEmail(
      { RESEND_API_KEY: "k", EMAIL_FROM: "f@x.com" },
      ALERT,
    );
    expect(m).not.toHaveBeenCalled();
  });

  it("swallows a non-ok Resend response and resolves (never breaks the write)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500 }) as Response),
    );
    await expect(
      sendSecurityAlertEmail(
        {
          RESEND_API_KEY: "k",
          EMAIL_FROM: "no-reply@x.com",
          SECURITY_ALERT_EMAIL: "soc@x.com",
        },
        ALERT,
      ),
    ).resolves.toBeUndefined();
  });
});
