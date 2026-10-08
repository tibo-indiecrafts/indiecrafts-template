import { afterEach, describe, expect, it, vi } from "vitest";

// Write-client + email mocks. `validateJoin` is pure, but it lives beside the
// engine's server-only imports (Sanity write client + the email graph, which read
// env at load) — the stubs keep importing the module from evaluating that env, and
// let the `join()` write-path tests drive the Sanity + mail calls.
const { fetch, create, getEmailStrings, sendEmail } = vi.hoisted(() => ({
  fetch: vi.fn(),
  create: vi.fn(async () => ({})),
  getEmailStrings: vi.fn(async () => null as unknown),
  sendEmail: vi.fn(async () => undefined),
}));

vi.mock("@indiecrafts/packages-web-sanity/write", () => ({
  writeClient: { fetch, create },
}));
vi.mock("@indiecrafts/packages-web-email/strings", () => ({
  getEmailStrings,
  pick: () => "",
}));
vi.mock("@indiecrafts/packages-web-email", () => ({
  sendEmail,
  renderEmailLayout: () => "",
  escapeHtml: (s: string) => s,
  // Templates read `const C = EMAIL_COLORS` at load; a Proxy answers any token key.
  EMAIL_COLORS: new Proxy({}, { get: () => "#000000" }),
}));

const { validateJoin, join } = await import("./waitlist");

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("validateJoin", () => {
  const ok = { email: "a@b.com", consent: true };

  it("accepts a valid email + consent", () => {
    expect(validateJoin(ok)).toEqual({ ok: true });
  });

  it("drops a honeypot-filled submission as spam", () => {
    expect(validateJoin({ ...ok, honeypot: "bot" })).toEqual({
      ok: false,
      error: "spam",
    });
  });

  it("rejects a bad or missing email", () => {
    expect(validateJoin({ ...ok, email: "nope" })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(validateJoin({ consent: true })).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("requires consent", () => {
    expect(validateJoin({ email: "a@b.com", consent: false })).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("rejects an over-long email", () => {
    expect(
      validateJoin({ email: `${"x".repeat(250)}@b.com`, consent: true }),
    ).toEqual({ ok: false, error: "invalid" });
  });

  it("drops a near-instant (bot) submit as spam", () => {
    expect(validateJoin({ ...ok, startedAt: Date.now() })).toEqual({
      ok: false,
      error: "spam",
    });
  });

  it("accepts a submit after a human delay", () => {
    expect(validateJoin({ ...ok, startedAt: Date.now() - 5000 })).toEqual({
      ok: true,
    });
  });

  it("ignores a client clock running ahead (negative elapsed → not flagged)", () => {
    expect(validateJoin({ ...ok, startedAt: Date.now() + 60_000 })).toEqual({
      ok: true,
    });
  });
});

describe("join", () => {
  const input = { email: "a@b.com", consent: true };

  it("an existing email is a no-op (already, no write)", async () => {
    fetch.mockResolvedValueOnce("wl.1");
    expect(await join(input, "2026-01-01", "v1")).toEqual({
      ok: true,
      already: true,
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("a new email creates a whitelisted entry with the policy stamp", async () => {
    fetch.mockResolvedValueOnce(null);
    expect(
      await join(
        { email: "New@B.com", consent: true, name: "Ada", language: "fr" },
        "2026-01-01",
        "v2",
      ),
    ).toEqual({ ok: true, already: false });
    const doc = create.mock.calls[0][0] as Record<string, unknown>;
    expect(doc._type).toBe("waitlistEntry"); // hard-coded, never from input
    expect(doc.email).toBe("new@b.com"); // normalized
    expect(doc.status).toBe("waiting");
    expect(doc.consent).toBe(true);
    expect(doc.consentPolicyVersion).toBe("v2");
    expect(doc.name).toBe("Ada");
  });

  it("a failing confirmation email never turns a saved entry into an error", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    getEmailStrings.mockResolvedValueOnce({
      waitlistConfirm: { enabled: true, from: "hi@site.com" },
    });
    sendEmail.mockRejectedValueOnce(new Error("mail down"));
    fetch.mockResolvedValueOnce(null);
    expect(await join(input, "2026-01-01")).toEqual({
      ok: true,
      already: false,
    });
    expect(create).toHaveBeenCalled();
  });

  it.each([
    ["fr", "Vous êtes sur la liste d'attente"],
    ["de", "You're on the waitlist"], // no copy for this locale → English
  ])(
    "empty Studio copy falls back to the %s default",
    async (language, subject) => {
      vi.stubEnv("RESEND_API_KEY", "re_x");
      getEmailStrings.mockResolvedValueOnce({
        waitlistConfirm: { enabled: true, from: "hi@site.com" },
      });
      fetch.mockResolvedValueOnce(null);
      await join({ ...input, language }, "2026-01-01");
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: ["a@b.com"], subject }),
      );
    },
  );

  it("a write failure returns a server error, not a throw", async () => {
    fetch.mockRejectedValueOnce(new Error("network"));
    expect(await join(input, "2026-01-01")).toEqual({
      ok: false,
      error: "server",
    });
  });
});
