import { afterEach, describe, expect, it, vi } from "vitest";

// Fluent write-client mock: patch(id).set(x).unset([...]).commit().
const { fetch, patch, set, unset, commit, del } = vi.hoisted(() => {
  const commit = vi.fn(async () => ({}));
  const unset = vi.fn(() => ({ commit }));
  const set = vi.fn(() => ({ unset }));
  const patch = vi.fn(() => ({ set }));
  const del = vi.fn(async () => ({}));
  const fetch = vi.fn();
  return { fetch, patch, set, unset, commit, del };
});

vi.mock("@indiecrafts/packages-web-sanity/write", () => ({
  writeClient: { fetch, patch, delete: del },
}));

const { moderateComment } = await import("./moderate");

afterEach(() => vi.clearAllMocks());

describe("moderateComment", () => {
  it("returns invalid for an unknown/used token", async () => {
    fetch.mockResolvedValueOnce(null);
    expect(await moderateComment("nope", "approve")).toBe("invalid");
    expect(patch).not.toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();
  });

  it("approve → approved:true, spam:false, clears the token", async () => {
    fetch.mockResolvedValueOnce("comment.1");
    expect(await moderateComment("t", "approve")).toBe("done");
    expect(patch).toHaveBeenCalledWith("comment.1");
    expect(set).toHaveBeenCalledWith({ approved: true, spam: false });
    expect(unset).toHaveBeenCalledWith(["moderationToken"]);
  });

  it("spam → spam:true, approved:false", async () => {
    fetch.mockResolvedValueOnce("comment.2");
    expect(await moderateComment("t", "spam")).toBe("done");
    expect(set).toHaveBeenCalledWith({ approved: false, spam: true });
  });

  it("delete → removes the doc (no patch)", async () => {
    fetch.mockResolvedValueOnce("comment.3");
    expect(await moderateComment("t", "delete")).toBe("done");
    expect(del).toHaveBeenCalledWith("comment.3");
    expect(patch).not.toHaveBeenCalled();
  });

  it("empty token is invalid without a lookup", async () => {
    expect(await moderateComment("  ", "approve")).toBe("invalid");
    expect(fetch).not.toHaveBeenCalled();
  });
});
