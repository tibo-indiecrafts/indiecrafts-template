import { describe, expect, it } from "vitest";
import { handleClerkEmail } from "./handle";

type Sent = {
  to: string;
  subject: string;
  html: string;
  text: string;
  bcc?: string;
};

// Minimal MAIN_DB stub: prepare().bind().first() → the given locale row (or null).
function db(locale: string | null) {
  return {
    prepare: () => ({
      bind: () => ({
        first: async () => (locale === null ? null : { locale }),
      }),
    }),
  } as unknown as D1Database;
}

const baseEnv = { RESEND_API_KEY: "k", EMAIL_FROM: "no-reply@x.com" };
const record = (sink: Sent[]) => async (_e: unknown, m: Sent) =>
  void sink.push(m);

describe("handleClerkEmail (Clerk email.created take-over)", () => {
  it("localizes the verification code by user_profiles.locale", async () => {
    const sent: Sent[] = [];
    await handleClerkEmail(
      { ...baseEnv, MAIN_DB: db("fr") },
      {
        to_email_address: "u@x.com",
        slug: "verification_code",
        user_id: "user_1",
        data: { otp_code: "123456" },
      },
      record(sent),
    );
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe("u@x.com");
    expect(sent[0].subject).toBe("Votre code de vérification");
    expect(sent[0].text).toContain("123456");
  });

  it("applies the Studio override copy (emailStrings) in the recipient locale", async () => {
    const sent: Sent[] = [];
    const fetchStrings = async () => ({
      verification: {
        subject: { fr: "Sujet personnalisé" },
        intro: { fr: "Votre code :" },
      },
      supportEmail: "support@x.com",
      bccAll: "copy@x.com",
    });
    await handleClerkEmail(
      { ...baseEnv, MAIN_DB: db("fr") },
      {
        to_email_address: "u@x.com",
        slug: "verification_code",
        user_id: "user_1",
        data: { otp_code: "123456" },
      },
      record(sent),
      fetchStrings,
    );
    expect(sent[0].subject).toBe("Sujet personnalisé"); // override wins
    expect(sent[0].text).toContain("Votre code :"); // overridden intro
    expect(sent[0].text).toContain("123456"); // the code is still injected
    expect(sent[0].html).toContain("mailto:support@x.com"); // support footer
    expect(sent[0].text).toContain("support@x.com");
    expect(sent[0].bcc).toBe("copy@x.com"); // global blind copy passed to the mailer
  });

  it("falls back to English when no locale is stored", async () => {
    const sent: Sent[] = [];
    await handleClerkEmail(
      { ...baseEnv, MAIN_DB: db(null) },
      {
        to_email_address: "u@x.com",
        slug: "verification_code",
        user_id: "u",
        data: { otp_code: "9" },
      },
      record(sent),
    );
    expect(sent[0].subject).toBe("Your verification code");
  });

  it("forwards an unknown slug's rendered body (never drops it)", async () => {
    const sent: Sent[] = [];
    await handleClerkEmail(
      { ...baseEnv, MAIN_DB: db("fr") },
      {
        to_email_address: "u@x.com",
        slug: "some_other_email",
        subject: "Hi",
        body: "<p>Hi</p>",
      },
      record(sent),
    );
    expect(sent[0].subject).toBe("Hi");
    expect(sent[0].html).toBe("<p>Hi</p>");
  });

  it("throws when the mailer is unconfigured (caller 502s → Clerk retries)", async () => {
    await expect(
      handleClerkEmail(
        { MAIN_DB: db("fr") },
        {
          to_email_address: "u@x.com",
          slug: "verification_code",
          data: { otp_code: "1" },
        },
        async () => {},
      ),
    ).rejects.toThrow();
  });

  it("no-ops (no send) when the event has no recipient", async () => {
    const sent: Sent[] = [];
    await handleClerkEmail(
      baseEnv,
      { slug: "verification_code" },
      record(sent),
    );
    expect(sent).toHaveLength(0);
  });

  it("localizes the new-device email with the revoke link when present", async () => {
    const sent: Sent[] = [];
    await handleClerkEmail(
      { ...baseEnv, MAIN_DB: db("fr") },
      {
        to_email_address: "u@x.com",
        slug: "sign_in_from_new_device",
        user_id: "u",
        data: {
          device_type: "iPhone",
          city: "Paris",
          country: "FR",
          revoke_session_url: "https://x/revoke",
        },
      },
      record(sent),
    );
    expect(sent[0].subject).toBe("Nouvelle connexion à votre compte");
    expect(sent[0].html).toContain("https://x/revoke");
    expect(sent[0].text).toContain("iPhone");
  });

  it("new-device email without a revoke link degrades to a password warning", async () => {
    const sent: Sent[] = [];
    await handleClerkEmail(
      { ...baseEnv, MAIN_DB: db(null) },
      {
        to_email_address: "u@x.com",
        slug: "new_device_sign_in",
        user_id: "u",
        data: { device_type: "Mac" },
      },
      record(sent),
    );
    expect(sent[0].subject).toBe("New sign-in to your account");
    expect(sent[0].html).not.toContain("<a href");
    expect(sent[0].html.toLowerCase()).toContain("change your password");
  });
});
