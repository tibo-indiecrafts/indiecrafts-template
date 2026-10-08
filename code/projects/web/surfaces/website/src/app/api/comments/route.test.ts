// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ comments: true }));
const createComment = vi.hoisted(() => vi.fn());
vi.mock("@indiecrafts/modules-web-blog/lib/route-gate", () => ({
  isCommentsEnabled: () => state.comments,
}));
vi.mock("@indiecrafts/modules-web-blog/lib/comments", () => ({ createComment }));
vi.mock("@indiecrafts/packages-web-compliance/sanity/policy-version", () => ({
  getConsentPolicyVersion: async () => "v1",
}));
vi.mock("@indiecrafts/packages-shared-security/rate-limit", () => ({
  rateLimit: async () => ({ ok: true }),
}));

const { POST } = await import("./route");
// Node env: happy-dom's Request drops the forbidden `Sec-Fetch-Site` header.
const post = (body: unknown, site = "same-origin") =>
  POST(
    new Request("https://x.test/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": site },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
const valid = { postId: "post.en.x", authorName: "Eve", body: "Hi", consent: true };

beforeEach(() => {
  state.comments = true;
  createComment.mockReset();
});

describe("POST /api/comments", () => {
  it("answers a stored and a spam-dropped comment alike — 201, same body", async () => {
    for (const result of [{ ok: true }, { ok: false, error: "spam" }]) {
      createComment.mockResolvedValueOnce(result);
      const res = await post(valid);
      expect(res.status).toBe(201);
      expect(await res.json()).toEqual({ ok: true });
    }
  });

  it("an invalid comment → 400, with the server's policy version", async () => {
    createComment.mockResolvedValueOnce({ ok: false, error: "invalid" });
    const res = await post({ ...valid, body: "", policyVersion: "forged" });
    expect(res.status).toBe(400);
    expect(createComment.mock.calls[0]?.[2]).toBe("v1");
  });

  it("the guard refuses cross-site, oversize and malformed bodies before the engine", async () => {
    expect((await post(valid, "cross-site")).status).toBe(403);
    expect((await post({ ...valid, body: "x".repeat(13_000) })).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
    expect(createComment).not.toHaveBeenCalled();
  });

  it("is a 404 with comments off", async () => {
    state.comments = false;
    expect((await post(valid)).status).toBe(404);
    expect(createComment).not.toHaveBeenCalled();
  });
});
