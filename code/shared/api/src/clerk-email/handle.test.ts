import { describe, expect, it } from "vitest";
import { handleClerkEmail } from "./handle";

type Sent = { to: string; subject: string; html: string; text: string };

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

describe("handleClerkEmail (Clerk emails.created take-over)", () => {
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
});
