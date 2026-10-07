import { describe, expect, it } from "vitest";
import { sendWelcomeEmail } from "./welcome";

type Sent = {
  to: string;
  subject: string;
  html: string;
  text: string;
  bcc?: string;
  idempotencyKey?: string;
};

const baseEnv = { RESEND_API_KEY: "k", EMAIL_FROM: "no-reply@x.com" };
const record = (sink: Sent[]) => async (_e: unknown, m: Sent) =>
  void sink.push(m);

describe("sendWelcomeEmail (post-signup welcome, user.created)", () => {
  it("sends a localized welcome in the resolved locale (hardcoded fallback)", async () => {
    const sent: Sent[] = [];
    await sendWelcomeEmail(
      baseEnv,
      { to: "u@x.com", locale: "fr", userId: "user_1" },
      record(sent),
      async () => null, // no Sanity copy → hardcoded fr fallback
    );
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe("u@x.com");
    expect(sent[0].subject).toBe("Bienvenue — votre compte est prêt");
    expect(sent[0].text.length).toBeGreaterThan(0);
    // A webhook retry re-sends the same key → Resend sends once.
    expect(sent[0].idempotencyKey).toBe("welcome/user_1");
    // A fragment, not a document: the wrapper tells a screen reader to read it in French.
    expect(sent[0].html.startsWith('<div lang="fr">')).toBe(true);
  });

  it("applies the Studio override copy (clerkEmails.welcome) in the recipient locale", async () => {
    const sent: Sent[] = [];
    const fetchStrings = async () => ({
      welcome: {
        subject: { fr: "Ravis de vous voir" },
        intro: { fr: "Votre espace est prêt." },
      },
      supportEmail: "support@x.com",
    });
    await sendWelcomeEmail(
      baseEnv,
      { to: "u@x.com", locale: "fr", userId: "user_1" },
      record(sent),
      fetchStrings,
    );
    expect(sent[0].subject).toBe("Ravis de vous voir"); // override wins
    expect(sent[0].text).toContain("Votre espace est prêt."); // overridden intro
    expect(sent[0].html).toContain("mailto:support@x.com"); // support footer
    expect(sent[0].bcc).toBeUndefined(); // no bccAll set
  });

  it("falls back to English when the locale is unknown", async () => {
    const sent: Sent[] = [];
    await sendWelcomeEmail(
      baseEnv,
      { to: "u@x.com", locale: "zz", userId: "user_1" },
      record(sent),
      async () => null,
    );
    expect(sent[0].subject).toBe("Welcome — your account is ready");
  });

  it("is best-effort: no send and NO throw when the mailer is unconfigured", async () => {
    const sent: Sent[] = [];
    await expect(
      sendWelcomeEmail(
        { RESEND_API_KEY: undefined, EMAIL_FROM: "no-reply@x.com" },
        { to: "u@x.com", locale: "en", userId: "user_1" },
        record(sent),
        async () => null,
      ),
    ).resolves.toBeUndefined();
    expect(sent).toHaveLength(0);
  });

  it("never rejects when Resend fails (a 403 or a timeout) — the webhook's waitUntil stays clean", async () => {
    const failing = async () => {
      throw new Error("resend 403");
    };
    await expect(
      sendWelcomeEmail(
        baseEnv,
        { to: "u@x.com", locale: "en", userId: "user_1" },
        failing,
        async () => null,
      ),
    ).resolves.toBeUndefined();
  });

  it("no-ops when there is no recipient", async () => {
    const sent: Sent[] = [];
    await sendWelcomeEmail(
      baseEnv,
      { to: "", locale: "en", userId: "user_1" },
      record(sent),
      async () => null,
    );
    expect(sent).toHaveLength(0);
  });
});
