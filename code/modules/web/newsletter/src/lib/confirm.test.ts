// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { subscribeContact, deliverMagnetsForTags, sendEmail, getEmailStrings } =
  vi.hoisted(() => ({
    subscribeContact: vi.fn(async (_i: unknown) => undefined),
    deliverMagnetsForTags: vi.fn(async (..._a: unknown[]) => undefined),
    sendEmail: vi.fn(async (_m: { to: string[]; text: string }) => undefined),
    getEmailStrings: vi.fn(async () => null as unknown),
  }));
vi.mock("./newsletter-contact", () => ({ subscribeContact }));
vi.mock("./deliver-magnet", () => ({ deliverMagnetsForTags }));
vi.mock("@indiecrafts/packages-web-email/strings", () => ({
  getEmailStrings,
  pick: () => "",
}));
vi.mock("@indiecrafts/packages-web-email", () => ({
  sendEmail,
  // The html is just `<html lang>`, so a test can check the recipient's language reached the layout.
  renderEmail: (e: { subject: string; text: string; lang?: string }) => ({
    subject: e.subject,
    text: e.text,
    html: `<html lang="${e.lang}">`,
  }),
  escapeHtml: (s: string) => s,
  EMAIL_COLORS: new Proxy({}, { get: () => "#000000" }),
}));

const {
  CONFIRM_TOKEN_DAYS,
  confirmSubscription,
  signConfirmToken,
  verifyConfirmToken,
} = await import("./confirm");

const SECRET = "test-newsletter-secret";
const ISSUED = "2026-10-08T10:00:00.000Z";
const T0 = Date.parse(ISSUED);
const payload = {
  email: "a@b.com",
  locale: "fr",
  newsletter: true,
  tags: [] as string[],
  source: "/blog/x",
  policyVersion: "v2",
  issuedAt: ISSUED,
};

beforeEach(() => vi.stubEnv("NEWSLETTER_SECRET", SECRET));
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("signConfirmToken / verifyConfirmToken", () => {
  it("round-trips the payload until it expires", async () => {
    const token = await signConfirmToken(payload, SECRET);
    expect(await verifyConfirmToken(token, SECRET, T0 + 1000)).toEqual(payload);
    const end = T0 + CONFIRM_TOKEN_DAYS * 86_400_000;
    expect(await verifyConfirmToken(token, SECRET, end)).toBeNull();
  });

  it("refuses a tampered token, another secret or a bad payload", async () => {
    const token = await signConfirmToken(payload, SECRET);
    expect(await verifyConfirmToken(`x${token}`, SECRET, T0)).toBeNull();
    expect(await verifyConfirmToken(token, "other", T0)).toBeNull();
    const badLocale = await signConfirmToken(
      { ...payload, locale: "xx" },
      SECRET,
    );
    expect(await verifyConfirmToken(badLocale, SECRET, T0)).toBeNull();
    const badEmail = await signConfirmToken(
      { ...payload, email: "nope" },
      SECRET,
    );
    expect(await verifyConfirmToken(badEmail, SECRET, T0)).toBeNull();
  });
});

describe("confirmSubscription", () => {
  it("is invalid without a token, without the secret, or for a bad token", async () => {
    expect(await confirmSubscription("  ", { now: T0 })).toBe("invalid");
    expect(await confirmSubscription("garbage", { now: T0 })).toBe("invalid");
    const token = await signConfirmToken(payload, SECRET);
    vi.stubEnv("NEWSLETTER_SECRET", "");
    expect(await confirmSubscription(token, { now: T0 })).toBe("invalid");
    expect(subscribeContact).not.toHaveBeenCalled();
  });

  it("subscribes a newsletter sign-up with its consent proof, then delivers + alerts", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    getEmailStrings.mockResolvedValue({
      newsletterOwner: {
        enabled: true,
        to: ["owner@site.test"],
        from: "hi@site.test",
      },
    });
    const token = await signConfirmToken({ ...payload, tags: ["m1"] }, SECRET);
    expect(
      await confirmSubscription(token, {
        now: T0 + 1000,
        clientIp: "203.0.113.7",
      }),
    ).toBe("confirmed");
    expect(subscribeContact).toHaveBeenCalledWith({
      email: "a@b.com",
      locale: "fr",
      policyVersion: "v2",
      consentAt: new Date(T0 + 1000).toISOString(), // the tap is the consent act
      clientIp: "203.0.113.7",
    });
    expect(deliverMagnetsForTags).toHaveBeenCalledWith("a@b.com", ["m1"], "fr");
    const alert = sendEmail.mock.calls[0]?.[0];
    expect(alert?.to).toEqual(["owner@site.test"]);
    expect(alert?.text).toContain("a@b.com");
  });

  it("never subscribes a lead-magnet-only request, but sends its document", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    getEmailStrings.mockResolvedValue({
      newsletterOwner: {
        enabled: true,
        to: ["owner@site.test"],
        from: "hi@site.test",
      },
    });
    const token = await signConfirmToken(
      { ...payload, newsletter: false, tags: ["m1"] },
      SECRET,
    );
    expect(await confirmSubscription(token, { now: T0 })).toBe("confirmed");
    expect(subscribeContact).not.toHaveBeenCalled();
    expect(deliverMagnetsForTags).toHaveBeenCalledWith("a@b.com", ["m1"], "fr");
    expect(sendEmail).not.toHaveBeenCalled(); // no "new subscriber" alert: nobody subscribed
  });

  it("answers error (and sends nothing) when the api fails", async () => {
    subscribeContact.mockRejectedValueOnce(
      new Error("newsletter/subscribers 502"),
    );
    const token = await signConfirmToken({ ...payload, tags: ["m1"] }, SECRET);
    expect(await confirmSubscription(token, { now: T0 })).toBe("error");
    expect(deliverMagnetsForTags).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
