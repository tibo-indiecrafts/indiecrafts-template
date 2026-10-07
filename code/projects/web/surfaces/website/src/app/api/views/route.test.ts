// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ blog: true }));
const recordPostView = vi.hoisted(() => vi.fn(async () => {}));
vi.mock("@indiecrafts/modules-web-blog/lib/route-gate", () => ({
  isBlogRouteEnabled: () => state.blog,
}));
vi.mock("@indiecrafts/modules-web-blog/lib/popularity", () => ({ recordPostView }));
vi.mock("@indiecrafts/packages-shared-security/rate-limit", () => ({
  rateLimit: async () => ({ ok: true }),
}));

const { POST } = await import("./route");
// Node env: happy-dom's Request drops the forbidden `Sec-Fetch-Site` header.
const beacon = (body: unknown, site = "same-origin") =>
  POST(
    new Request("https://x.test/api/views", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": site },
      body: JSON.stringify(body),
    }),
  );

beforeEach(() => {
  recordPostView.mockClear();
  state.blog = true;
});

describe("POST /api/views", () => {
  it("counts a published post in a site locale — 204, nothing in the body", async () => {
    const res = await beacon({ postId: "post.fr.fast-proto-nextjs", locale: "fr" });
    expect(res.status).toBe(204);
    expect(recordPostView).toHaveBeenCalledWith(
      expect.objectContaining({ postId: "post.fr.fast-proto-nextjs", locale: "fr" }),
    );
  });

  it("rejects drafts, odd ids and unknown locales without counting", async () => {
    for (const body of [
      { postId: "drafts.post.fr.x", locale: "fr" },
      { postId: "versions.r1.post", locale: "en" },
      { postId: "x y", locale: "en" },
      { postId: "a".repeat(129), locale: "en" },
      { postId: "post.x", locale: "de" },
      {},
    ]) {
      expect((await beacon(body)).status, JSON.stringify(body)).toBe(400);
    }
    expect(recordPostView).not.toHaveBeenCalled();
  });

  it("refuses a cross-site request", async () => {
    expect((await beacon({ postId: "p", locale: "en" }, "cross-site")).status).toBe(403);
    expect(recordPostView).not.toHaveBeenCalled();
  });

  it("is a 404 with the blog off", async () => {
    state.blog = false;
    expect((await beacon({ postId: "p", locale: "en" })).status).toBe(404);
  });
});
