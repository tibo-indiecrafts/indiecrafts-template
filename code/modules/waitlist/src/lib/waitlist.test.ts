import { describe, expect, it, vi } from "vitest";

// `validateJoin` is pure, but it lives beside the engine's server-only imports
// (Sanity write client + the email graph, which read env at load). Stub those so
// importing the module never evaluates the Sanity env in the test runner.
vi.mock("@indiecrafts/sanity/write", () => ({ writeClient: {} }));
vi.mock("@indiecrafts/email/strings", () => ({ getEmailStrings: async () => null, pick: () => "" }));
vi.mock("@indiecrafts/email", () => ({
  renderWaitlistConfirmEmail: () => ({ subject: "", text: "", html: "" }),
  renderWaitlistNotificationEmail: () => ({ subject: "", text: "", html: "" }),
  sendEmail: async () => undefined,
}));

const { validateJoin } = await import("./waitlist");

describe("validateJoin", () => {
  const ok = { email: "a@b.com", consent: true };

  it("accepts a valid email + consent", () => {
    expect(validateJoin(ok)).toEqual({ ok: true });
  });

  it("drops a honeypot-filled submission as spam", () => {
    expect(validateJoin({ ...ok, honeypot: "bot" })).toEqual({ ok: false, error: "spam" });
  });

  it("rejects a bad or missing email", () => {
    expect(validateJoin({ ...ok, email: "nope" })).toEqual({ ok: false, error: "invalid" });
    expect(validateJoin({ consent: true })).toEqual({ ok: false, error: "invalid" });
  });

  it("requires consent", () => {
    expect(validateJoin({ email: "a@b.com", consent: false })).toEqual({ ok: false, error: "invalid" });
  });

  it("rejects an over-long email", () => {
    expect(validateJoin({ email: `${"x".repeat(250)}@b.com`, consent: true })).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});
