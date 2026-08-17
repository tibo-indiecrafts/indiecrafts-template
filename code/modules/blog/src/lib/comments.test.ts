import { describe, expect, it, vi } from "vitest";

// `validateComment` is pure, but it lives beside server-only imports (Sanity write
// client + the comment-notification email graph). Stub those so importing the module
// never evaluates their env in the test runner.
vi.mock("@indiecrafts/sanity/write", () => ({ writeClient: {} }));
vi.mock("./notify-comment", () => ({ notifyNewComment: async () => undefined }));

const { validateComment } = await import("./comments");

describe("validateComment", () => {
  const ok = { postId: "post-123", authorName: "Ada", body: "Nice post", consent: true };

  it("accepts a valid comment", () => {
    expect(validateComment(ok)).toEqual({ ok: true });
  });

  it("drops a honeypot-filled submission as spam", () => {
    expect(validateComment({ ...ok, honeypot: "x" })).toEqual({ ok: false, error: "spam" });
  });

  it("drops a near-instant (bot) submit as spam", () => {
    expect(validateComment({ ...ok, startedAt: Date.now() })).toEqual({ ok: false, error: "spam" });
  });

  it("rejects a malformed or empty postId", () => {
    expect(validateComment({ ...ok, postId: "a b/c" })).toEqual({ ok: false, error: "invalid" });
    expect(validateComment({ ...ok, postId: "" })).toEqual({ ok: false, error: "invalid" });
  });

  it("rejects an over-long optional email but accepts a valid one", () => {
    expect(validateComment({ ...ok, authorEmail: `${"x".repeat(250)}@b.com` })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(validateComment({ ...ok, authorEmail: "a@b.com" })).toEqual({ ok: true });
  });

  it("requires consent", () => {
    expect(validateComment({ ...ok, consent: false })).toEqual({ ok: false, error: "invalid" });
  });
});
