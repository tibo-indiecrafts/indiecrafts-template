import { afterEach, describe, expect, it, vi } from "vitest";

// Write-client + notify mocks. `validateComment` is pure, but it lives beside
// server-only imports (Sanity write client + the comment-notification email graph);
// the stubs keep the import from evaluating env, and drive the `createComment`
// write-path + threading tests.
const { fetch, create, notifyNewComment } = vi.hoisted(() => ({
  fetch: vi.fn(),
  create: vi.fn(async () => ({})),
  notifyNewComment: vi.fn(async () => undefined),
}));

vi.mock("@indiecrafts/sanity/write", () => ({
  writeClient: { fetch, create },
}));
vi.mock("./notify-comment", () => ({ notifyNewComment }));

const { validateComment, createComment } = await import("./comments");

afterEach(() => vi.clearAllMocks());

describe("validateComment", () => {
  const ok = {
    postId: "post-123",
    authorName: "Ada",
    body: "Nice post",
    consent: true,
  };

  it("accepts a valid comment", () => {
    expect(validateComment(ok)).toEqual({ ok: true });
  });

  it("drops a honeypot-filled submission as spam", () => {
    expect(validateComment({ ...ok, honeypot: "x" })).toEqual({
      ok: false,
      error: "spam",
    });
  });

  it("drops a near-instant (bot) submit as spam", () => {
    expect(validateComment({ ...ok, startedAt: Date.now() })).toEqual({
      ok: false,
      error: "spam",
    });
  });

  it("rejects a malformed or empty postId", () => {
    expect(validateComment({ ...ok, postId: "a b/c" })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(validateComment({ ...ok, postId: "" })).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("rejects an over-long optional email but accepts a valid one", () => {
    expect(
      validateComment({ ...ok, authorEmail: `${"x".repeat(250)}@b.com` }),
    ).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(validateComment({ ...ok, authorEmail: "a@b.com" })).toEqual({
      ok: true,
    });
  });

  it("requires consent", () => {
    expect(validateComment({ ...ok, consent: false })).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("createComment", () => {
  const input = {
    postId: "post.1",
    authorName: "Ada",
    body: "Nice post",
    consent: true,
  };

  it("rejects a comment on a non-existent post (no write)", async () => {
    fetch.mockResolvedValueOnce(null); // post-existence check
    expect(await createComment(input, "2026-01-01")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("creates an unapproved, whitelisted comment with a hard-coded _type", async () => {
    fetch.mockResolvedValueOnce("post.1"); // post exists
    expect(await createComment(input, "2026-01-01", "v1")).toEqual({
      ok: true,
    });
    const doc = create.mock.calls[0][0] as Record<string, unknown>;
    expect(doc._type).toBe("comment");
    expect(doc.approved).toBe(false);
    expect(doc.post).toEqual({ _type: "reference", _ref: "post.1" });
    expect(doc.consentPolicyVersion).toBe("v1");
    expect(doc.parent).toBeUndefined();
    expect(notifyNewComment).toHaveBeenCalled();
  });

  it("threads a reply onto an approved parent on the SAME post", async () => {
    fetch.mockResolvedValueOnce("post.1"); // post exists
    fetch.mockResolvedValueOnce("post.1"); // parent is approved + on post.1
    await createComment({ ...input, parentId: "comment.9" }, "2026-01-01");
    const doc = create.mock.calls[0][0] as Record<string, unknown>;
    expect(doc.parent).toEqual({ _type: "reference", _ref: "comment.9" });
  });

  it("ignores a parent that lives on another post (stored top-level)", async () => {
    fetch.mockResolvedValueOnce("post.1"); // post exists
    fetch.mockResolvedValueOnce("post.2"); // parent belongs to a different post
    await createComment({ ...input, parentId: "comment.9" }, "2026-01-01");
    const doc = create.mock.calls[0][0] as Record<string, unknown>;
    expect(doc.parent).toBeUndefined();
  });

  it("ignores an unapproved / unknown parent (query returns null)", async () => {
    fetch.mockResolvedValueOnce("post.1"); // post exists
    fetch.mockResolvedValueOnce(null); // parent not approved / not found
    await createComment({ ...input, parentId: "comment.9" }, "2026-01-01");
    const doc = create.mock.calls[0][0] as Record<string, unknown>;
    expect(doc.parent).toBeUndefined();
  });

  it("a write failure returns a server error, not a throw", async () => {
    fetch.mockRejectedValueOnce(new Error("network"));
    expect(await createComment(input, "2026-01-01")).toEqual({
      ok: false,
      error: "server",
    });
  });
});
