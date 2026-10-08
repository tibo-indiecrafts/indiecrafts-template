import { afterEach, describe, expect, it, vi } from "vitest";

// Fluent write-client mock: fetch + create + patch(id).set(x).commit() and
// patch(id).set(x).unset([...]).commit(). getEmailStrings is a vi.fn so a test can
// arm the confirm-email path per case.
const { fetch, patch, set, unset, commit, create, getEmailStrings } =
  vi.hoisted(() => {
    const commit = vi.fn(async () => ({}));
    const unset = vi.fn(() => ({ commit }));
    const set = vi.fn(() => ({ commit, unset }));
    const patch = vi.fn(() => ({ set }));
    const create = vi.fn(async () => ({}));
    const fetch = vi.fn();
    const getEmailStrings = vi.fn(async () => null as unknown);
    return { fetch, patch, set, unset, commit, create, getEmailStrings };
  });

vi.mock("@indiecrafts/packages-web-sanity/write", () => ({
  writeClient: { fetch, patch, create },
}));
vi.mock("@indiecrafts/packages-web-email/strings", () => ({
  getEmailStrings,
  pick: () => "",
}));
vi.mock("@indiecrafts/packages-web-email", () => ({
  sendEmail: async () => undefined,
  renderEmailLayout: () => "",
  escapeHtml: (s: string) => s,
  // Templates read `const C = EMAIL_COLORS` at load; a Proxy answers any token key.
  EMAIL_COLORS: new Proxy({}, { get: () => "#000000" }),
}));

const { deliverMagnetsForTags, syncNewsletterContact } = vi.hoisted(() => ({
  deliverMagnetsForTags: vi.fn(async () => undefined),
  syncNewsletterContact: vi.fn(async () => undefined),
}));
vi.mock("./deliver-magnet", () => ({ deliverMagnetsForTags }));
vi.mock("./newsletter-contact", () => ({ syncNewsletterContact }));

const { validateSubscribe, subscribe } = await import("./newsletter");

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
  const input = { email: "a@b.com", consent: true };

  it("an already-confirmed email is a no-op (already, no write)", async () => {
    fetch.mockResolvedValueOnce({ _id: "sub.1", status: "confirmed" });
    expect(await subscribe(input, "2026-01-01", "v1")).toEqual({
      ok: true,
      already: true,
    });
    expect(patch).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(syncNewsletterContact).not.toHaveBeenCalled();
  });

  it("a confirmed address that asks for a lead magnet gets it at once — no newsletter consent added", async () => {
    fetch.mockResolvedValueOnce({
      _id: "sub.1",
      status: "confirmed",
      tags: ["old"],
    });
    const res = await subscribe(
      { ...input, source: "lead-magnet", tags: ["guide"], language: "fr" },
      "2026-01-01",
    );
    expect(res).toEqual({ ok: true, already: true });
    expect(set).toHaveBeenCalledWith({ tags: ["old", "guide"] });
    expect(deliverMagnetsForTags).toHaveBeenCalledWith(
      "a@b.com",
      ["guide"],
      "fr",
    );
    expect(syncNewsletterContact).not.toHaveBeenCalled();
  });

  it("a confirmed lead-magnet-only address that now signs up gains newsletter consent + the Resend sync", async () => {
    fetch.mockResolvedValueOnce({
      _id: "sub.1",
      status: "confirmed",
      source: "lead-magnet",
      language: "fr",
    });
    await subscribe({ ...input, source: "/blog" }, "2026-01-01", "v3");
    expect(set).toHaveBeenCalledWith({
      newsletter: true,
      consentPolicyVersion: "v3",
    });
    expect(syncNewsletterContact).toHaveBeenCalledWith({
      email: "a@b.com",
      locale: "fr",
      granted: true,
    });
  });

  it("a pending email re-arms (patch), never creates a duplicate", async () => {
    fetch.mockResolvedValueOnce({ _id: "sub.2", status: "pending" });
    expect(await subscribe(input, "2026-01-01", "v1")).toEqual({
      ok: true,
      already: false,
    });
    expect(patch).toHaveBeenCalledWith("sub.2");
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "pending",
        consentPolicyVersion: "v1",
      }),
    );
    expect(create).not.toHaveBeenCalled();
  });

  it("an unsubscribed address re-arms with this request's consent only — a lead magnet never re-subscribes", async () => {
    fetch.mockResolvedValueOnce({
      _id: "sub.4",
      status: "unsubscribed",
      newsletter: true,
    });
    await subscribe(
      { ...input, source: "lead-magnet", tags: ["guide"] },
      "2026-01-01",
    );
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "pending",
        newsletter: false,
        tags: ["guide"],
      }),
    );
  });

  it("an unsubscribed email re-arms to pending (never dead-ends)", async () => {
    fetch.mockResolvedValueOnce({ _id: "sub.3", status: "unsubscribed" });
    expect(await subscribe(input, "2026-01-01")).toEqual({
      ok: true,
      already: false,
    });
    expect(patch).toHaveBeenCalledWith("sub.3");
    expect(create).not.toHaveBeenCalled();
  });

  it("a new email creates a whitelisted subscriber doc with the policy stamp", async () => {
    fetch.mockResolvedValueOnce(null);
    expect(
      await subscribe(
        { email: "New@B.com", consent: true, source: "/x", language: "fr" },
        "2026-01-01",
        "v2",
      ),
    ).toEqual({ ok: true, already: false });
    const doc = create.mock.calls[0][0] as Record<string, unknown>;
    expect(doc._type).toBe("subscriber"); // hard-coded, never from input
    expect(doc.email).toBe("new@b.com"); // normalized
    expect(doc.status).toBe("pending");
    expect(doc.consent).toBe(true);
    expect(doc.consentPolicyVersion).toBe("v2");
    expect(doc.confirmToken).toBeUndefined(); // no RESEND key → no token minted
    expect(doc.newsletter).toBe(true);
  });

  it("a lead-magnet sign-up is stored without newsletter consent", async () => {
    fetch.mockResolvedValueOnce(null);
    await subscribe(
      { ...input, source: "lead-magnet", tags: ["guide"] },
      "2026-01-01",
    );
    const doc = create.mock.calls[0][0] as Record<string, unknown>;
    expect(doc.newsletter).toBe(false);
    expect(doc.tags).toEqual(["guide"]);
  });

  it("mints a confirm token only when the confirmation email can be sent", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_x");
    getEmailStrings.mockResolvedValueOnce({
      newsletterConfirm: { enabled: true, from: "hi@site.com" },
    });
    fetch.mockResolvedValueOnce(null);
    await subscribe(input, "2026-01-01", "v1");
    const doc = create.mock.calls[0][0] as Record<string, unknown>;
    expect(typeof doc.confirmToken).toBe("string");
    expect(doc.confirmTokenAt).toBe("2026-01-01"); // the expiry clock starts here
  });

  it("a write failure returns a server error, not a throw", async () => {
    fetch.mockRejectedValueOnce(new Error("network"));
    expect(await subscribe(input, "2026-01-01")).toEqual({
      ok: false,
      error: "server",
    });
  });
});
