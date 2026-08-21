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
    });
    expect(await confirmSubscriber("tok")).toBe("confirmed");
    expect(patch).toHaveBeenCalledWith("sub.1");
    expect(set).toHaveBeenCalledWith({ status: "confirmed" });
    expect(unset).toHaveBeenCalledWith(["confirmToken"]);
    expect(deliverMagnetsForTags).toHaveBeenCalledWith(
      "a@b.com",
      ["magnet.1"],
      "fr",
    );
  });

  it("a write failure is swallowed to invalid, never throws", async () => {
    fetch.mockRejectedValueOnce(new Error("network"));
    expect(await confirmSubscriber("tok")).toBe("invalid");
  });
});
