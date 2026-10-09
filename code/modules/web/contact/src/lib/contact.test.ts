import { afterEach, describe, expect, it, vi } from "vitest";

// Write-client + email mocks. `validateSubmit` is pure, but it lives beside the
// engine's server-only imports (Sanity write client + the email graph, which read
// env at load) — the stubs keep importing the module from evaluating that env, and
// let the `submit()` write-path tests drive the Sanity + mail calls.
const { create, getEmailStrings, sendEmail } = vi.hoisted(() => ({
  create: vi.fn(async () => ({})),
  getEmailStrings: vi.fn(async () => null as unknown),
  sendEmail: vi.fn(async () => undefined),
}));

vi.mock("@indiecrafts/packages-web-sanity/write", () => ({
  writeClient: { create },
}));
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
  // Templates read `const C = EMAIL_COLORS` at load; a Proxy answers any token key.
  EMAIL_COLORS: new Proxy({}, { get: () => "#000000" }),
}));

const { validateSubmit, submit } = await import("./contact");

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("validateSubmit", () => {
  const ok = { email: "a@b.com", message: "Bonjour", consent: true };

  it("accepts a valid email + message + consent", () => {
    expect(validateSubmit(ok)).toEqual({ ok: true });
  });

  it("drops a honeypot-filled submission as spam", () => {
    expect(validateSubmit({ ...ok, honeypot: "bot" })).toEqual({
      ok: false,
      error: "spam",
    });
  });

  it("rejects a bad or missing email", () => {
    expect(validateSubmit({ ...ok, email: "nope" })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(validateSubmit({ message: "hi", consent: true })).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("rejects an empty or over-long message", () => {
    expect(validateSubmit({ ...ok, message: "  " })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(validateSubmit({ ...ok, message: "x".repeat(5001) })).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("requires consent", () => {
    expect(validateSubmit({ ...ok, consent: false })).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("drops a near-instant (bot) submit as spam", () => {
    expect(validateSubmit({ ...ok, startedAt: Date.now() })).toEqual({
      ok: false,
      error: "spam",
    });
  });

  it("accepts a submit after a human delay", () => {
    expect(validateSubmit({ ...ok, startedAt: Date.now() - 5000 })).toEqual({
      ok: true,
    });
  });

  it("ignores a client clock running ahead (negative elapsed → not flagged)", () => {
    expect(validateSubmit({ ...ok, startedAt: Date.now() + 60_000 })).toEqual({
      ok: true,
    });
  });
});

describe("submit", () => {
  const input = { email: "a@b.com", message: "Bonjour", consent: true };

  it("stores a whitelisted message with the policy stamp", async () => {
    expect(
      await submit(
        {
          email: "New@B.com",
          message: "Coucou",
          subject: "Devis",
          consent: true,
          name: "Ada",
          language: "fr",
        },
        "2026-01-01",
        "v2",
      ),
    ).toEqual({ ok: true });
    const doc = create.mock.calls[0][0] as Record<string, unknown>;
    expect(doc._type).toBe("contactMessage"); // hard-coded, never from input
    expect(doc._id).toMatch(/^private\.contactMessage\./); // dotted → hidden from anonymous reads
    expect(doc.email).toBe("new@b.com"); // normalized
    expect(doc.status).toBe("new");
    expect(doc.consent).toBe(true);
    expect(doc.consentPolicyVersion).toBe("v2");
    expect(doc.name).toBe("Ada");
    expect(doc.subject).toBe("Devis");
    expect(doc.message).toBe("Coucou");
  });

  it("a failing acknowledgement email never turns a saved message into an error", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    getEmailStrings.mockResolvedValueOnce({
      contactConfirm: { enabled: true, from: "hi@site.com" },
    });
    sendEmail.mockRejectedValueOnce(new Error("mail down"));
    expect(await submit(input, "2026-01-01")).toEqual({ ok: true });
    expect(create).toHaveBeenCalled();
  });

  it.each([
    ["fr", "Nous avons bien reçu votre message", "fr"],
    ["de", "We received your message", "en"], // not a site locale → the default (en)
  ])(
    "empty Studio copy falls back to the %s default",
    async (language, subject, lang) => {
      vi.stubEnv("RESEND_API_KEY", "re_x");
      getEmailStrings.mockResolvedValueOnce({
        contactConfirm: { enabled: true, from: "hi@site.com" },
      });
      await submit({ ...input, language }, "2026-01-01");
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ["a@b.com"],
          subject,
          html: `<html lang="${lang}">`,
        }),
      );
    },
  );

  it("a write failure returns a server error, not a throw", async () => {
    create.mockRejectedValueOnce(new Error("network"));
    expect(await submit(input, "2026-01-01")).toEqual({
      ok: false,
      error: "server",
    });
  });
});
