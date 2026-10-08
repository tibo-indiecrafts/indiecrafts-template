import { afterEach, describe, expect, it, vi } from "vitest";

// Fluent write-client mock: patch(id).set(x).unset([...]).commit(). deliverMagnets
// is stubbed (it imports gated-delivery + email, which read env at load).
const { fetch, patch, set, unset, commit, deliverMagnetsForTags } = vi.hoisted(
  () => {
    const commit = vi.fn(async () => ({}));
    const unset = vi.fn(() => ({ commit }));
    const set = vi.fn(() => ({ unset }));
    const patch = vi.fn(() => ({ set }));
    const fetch = vi.fn();
    const deliverMagnetsForTags = vi.fn(async () => undefined);
    return { fetch, patch, set, unset, commit, deliverMagnetsForTags };
  },
);

vi.mock("@indiecrafts/packages-web-sanity/write", () => ({
  writeClient: { fetch, patch },
}));
vi.mock("./deliver-magnet", () => ({ deliverMagnetsForTags }));
const syncNewsletterContact = vi.hoisted(() => vi.fn(async () => undefined));
vi.mock("./newsletter-contact", () => ({ syncNewsletterContact }));

const { confirmSubscriber } = await import("./confirm");

afterEach(() => vi.clearAllMocks());

describe("confirmSubscriber", () => {
  it("an empty token is invalid without a lookup", async () => {
    expect(await confirmSubscriber("  ")).toBe("invalid");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("an unknown / already-used token is invalid, no write", async () => {
    fetch.mockResolvedValueOnce(null);
    expect(await confirmSubscriber("nope")).toBe("invalid");
    expect(patch).not.toHaveBeenCalled();
  });

  it("flips a pending subscriber to confirmed, clears the token, delivers magnets", async () => {
    fetch.mockResolvedValueOnce({
      _id: "sub.1",
      email: "a@b.com",
      language: "fr",
      tags: ["magnet.1"],
      source: "lead-magnet",
      newsletter: false,
    });
    expect(await confirmSubscriber("tok")).toBe("confirmed");
    expect(patch).toHaveBeenCalledWith("sub.1");
    expect(set).toHaveBeenCalledWith({ status: "confirmed" });
    expect(unset).toHaveBeenCalledWith(["confirmToken", "confirmTokenAt"]);
    expect(deliverMagnetsForTags).toHaveBeenCalledWith(
      "a@b.com",
      ["magnet.1"],
      "fr",
    );
    // A lead-magnet-only sign-up never joins the newsletter in Resend.
    expect(syncNewsletterContact).not.toHaveBeenCalled();
  });

  it("a confirmed newsletter sign-up is mirrored to Resend's news topic", async () => {
    fetch.mockResolvedValueOnce({
      _id: "sub.2",
      email: "n@b.com",
      newsletter: true,
    });
    expect(await confirmSubscriber("tok")).toBe("confirmed");
    expect(syncNewsletterContact).toHaveBeenCalledWith({
      email: "n@b.com",
      locale: "en",
      granted: true,
    });
  });

  it("only matches a token issued within the last 7 days", async () => {
    fetch.mockResolvedValueOnce(null);
    await confirmSubscriber("tok", new Date("2026-10-08T12:00:00Z"));
    const [query, params] = fetch.mock.calls[0] as [
      string,
      Record<string, string>,
    ];
    expect(query).toContain("confirmTokenAt > $since");
    expect(params.since).toBe("2026-10-01T12:00:00.000Z");
  });

  it("a write failure is swallowed to invalid, never throws", async () => {
    fetch.mockRejectedValueOnce(new Error("network"));
    expect(await confirmSubscriber("tok")).toBe("invalid");
  });
});
