// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getEmailStrings, sendEmail } = vi.hoisted(() => ({
  getEmailStrings: vi.fn(async () => null as unknown),
  sendEmail: vi.fn(
    async (_m: { to: string[]; subject: string; text: string }) => undefined,
  ),
}));
vi.mock("@indiecrafts/packages-web-email/strings", () => ({
  getEmailStrings,
  // The real resolver, minus the default-locale fallback: a localized value → its string.
  pick: (v: unknown, locale: string) =>
    (v as Record<string, string> | undefined)?.[locale] ?? "",
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
  // Templates read `const C = EMAIL_COLORS` at load; a Proxy answers any token key.
  EMAIL_COLORS: new Proxy({}, { get: () => "#000000" }),
}));

// Sign-up never delivers a document; the real module would load the Sanity client.
vi.mock("./deliver-magnet", () => ({ deliverMagnetsForTags: vi.fn() }));

const { validateSubscribe, subscribe } = await import("./newsletter");
const { verifyConfirmToken } = await import("./confirm");

const SECRET = "test-newsletter-secret";
const NOW = Date.parse("2026-10-08T10:00:00.000Z");
const input = { email: "New@B.com", consent: true, source: "/blog/x" };

/** Arm every requirement of a sign-up: secret, Resend, the confirm email, the api. */
function armed() {
  vi.stubEnv("NEWSLETTER_SECRET", SECRET);
  vi.stubEnv("RESEND_API_KEY", "re_x");
  vi.stubEnv("API_URL", "https://api.test");
  vi.stubEnv("APP_API_TOKEN", "tok");
  getEmailStrings.mockResolvedValue({
    newsletterConfirm: { enabled: true, from: "hi@site.test" },
  });
}

/** The confirm link of the last email, and the payload its token carries. */
async function sentLink() {
  const mail = sendEmail.mock.calls.at(-1)?.[0];
  const link = mail?.text.match(/https?:\/\/\S+/)?.[0] ?? "";
  const token = decodeURIComponent(link.split("#t=")[1] ?? "");
  return { mail, link, payload: await verifyConfirmToken(token, SECRET, NOW) };
}

beforeEach(armed);
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("validateSubscribe", () => {
  const ok = { email: "a@b.com", consent: true };

  it("accepts a valid email + consent", () => {
    expect(validateSubscribe(ok)).toEqual({ ok: true });
  });

  it("drops a honeypot-filled submission as spam", () => {
    expect(validateSubscribe({ ...ok, honeypot: "bot" })).toEqual({
      ok: false,
      error: "spam",
    });
  });

  it("drops a near-instant (bot) submit as spam", () => {
    expect(validateSubscribe({ ...ok, startedAt: Date.now() })).toEqual({
      ok: false,
      error: "spam",
    });
  });

  it("rejects a bad/missing email and requires consent", () => {
    expect(validateSubscribe({ ...ok, email: "nope" })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(validateSubscribe({ email: "a@b.com", consent: false })).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("subscribe", () => {
  it("stores nothing and mails a signed link carrying the sign-up", async () => {
    expect(
      await subscribe({ ...input, language: "fr", tags: ["m1"] }, "v2", NOW),
    ).toEqual({
      ok: true,
    });
    const { mail, payload } = await sentLink();
    expect(mail?.to).toEqual(["new@b.com"]);
    expect(payload).toEqual({
      email: "new@b.com",
      locale: "fr",
      newsletter: true,
      tags: ["m1"],
      source: "/blog/x",
      policyVersion: "v2",
      issuedAt: "2026-10-08T10:00:00.000Z",
    });
  });

  it.each([
    ["fr", "Confirmez votre inscription", "/fr/newsletter/confirm#t="],
    ["en", "Confirm your subscription", "/newsletter/confirm#t="],
  ])(
    "a %s sign-up gets the email and link in its language",
    async (language, subject, path) => {
      await subscribe({ ...input, language }, "v2", NOW);
      const { mail, link } = await sentLink();
      expect(mail?.subject).toBe(subject);
      expect(mail?.html).toBe(`<html lang="${language}">`);
      expect(link).toContain(path);
      if (language === "en") expect(link).not.toContain("/fr/");
    },
  );

  it("keeps the token out of the query string (the fragment never reaches a server)", async () => {
    await subscribe(input, "v2", NOW);
    const { link } = await sentLink();
    expect(link).not.toContain("?");
  });

  it("falls back to the default locale for an unknown language", async () => {
    await subscribe({ ...input, language: "xx" }, "v2", NOW);
    expect((await sentLink()).payload?.locale).toBe("en");
  });

  it("marks a lead-magnet request as not a newsletter sign-up", async () => {
    await subscribe(
      { ...input, source: "lead-magnet", tags: ["m1"] },
      "v2",
      NOW,
    );
    expect((await sentLink()).payload?.newsletter).toBe(false);
  });

  it("a lead-magnet request reads as a document request, never the newsletter", async () => {
    await subscribe(
      { ...input, source: "lead-magnet", language: "fr", tags: ["m1"] },
      "v2",
      NOW,
    );
    const { mail } = await sentLink();
    expect(mail?.subject).toBe("Confirmez votre demande");
    expect(mail?.text).toContain("Cela ne vous inscrit pas à l'infolettre.");
    expect(mail?.text).not.toContain("recevoir l'infolettre");
  });

  it("the Studio copy overrides each purpose's defaults, never the other's", async () => {
    getEmailStrings.mockResolvedValue({
      newsletterConfirm: {
        enabled: true,
        from: "hi@site.test",
        subject: { en: "Join us" },
      },
      leadMagnetConfirm: { subject: { en: "Your guide awaits" } },
    });
    await subscribe(
      { ...input, source: "lead-magnet", tags: ["m1"] },
      "v2",
      NOW,
    );
    expect((await sentLink()).mail?.subject).toBe("Your guide awaits");
    await subscribe(input, "v2", NOW);
    expect((await sentLink()).mail?.subject).toBe("Join us");
  });

  it.each([
    ["the secret", () => vi.stubEnv("NEWSLETTER_SECRET", "")],
    ["Resend", () => vi.stubEnv("RESEND_API_KEY", "")],
    ["the confirm email", () => getEmailStrings.mockResolvedValue(null)],
    ["the api", () => vi.stubEnv("API_URL", "")],
  ])("is unavailable without %s, and sends nothing", async (_name, unset) => {
    unset();
    expect(await subscribe(input, "v2", NOW)).toEqual({
      ok: false,
      error: "unavailable",
    });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("a lead-magnet request does not need the api", async () => {
    vi.stubEnv("API_URL", "");
    expect(
      await subscribe({ ...input, source: "lead-magnet" }, "v2", NOW),
    ).toEqual({
      ok: true,
    });
  });

  it("a failed send is a server error, not a throw", async () => {
    sendEmail.mockRejectedValueOnce(new Error("mail down"));
    expect(await subscribe(input, "v2", NOW)).toEqual({
      ok: false,
      error: "server",
    });
  });
});
