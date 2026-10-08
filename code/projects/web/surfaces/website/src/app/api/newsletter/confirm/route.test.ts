// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

// The flag gate + the engine outcomes are in `../route.test.ts`; this file guards the boundary.
const confirmSubscription = vi.hoisted(() => vi.fn());
vi.mock("@indiecrafts/modules-web-newsletter/lib/confirm", () => ({
  confirmSubscription,
}));
vi.mock("@indiecrafts/packages-shared-security/rate-limit", () => ({
  rateLimit: async () => ({ ok: true }),
}));

const route = await import("./route");
// Node env: happy-dom's Request drops the forbidden `Sec-Fetch-Site` header.
const post = (body: unknown, site = "same-origin") =>
  route.POST(
    new Request("https://x.test/api/newsletter/confirm", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": site },
      body: JSON.stringify(body),
    }),
  );

beforeEach(() => confirmSubscription.mockReset());

describe("POST /api/newsletter/confirm — boundary", () => {
  it("is POST-only, so a mail scanner's GET can never confirm", () => {
    expect(Object.keys(route)).toEqual(["POST"]);
  });

  it("refuses cross-site and oversize posts before the engine", async () => {
    expect((await post({ token: "t" }, "cross-site")).status).toBe(403);
    expect((await post({ token: "x".repeat(4500) })).status).toBe(413);
    expect(confirmSubscription).not.toHaveBeenCalled();
  });

  it("a missing token reaches the engine as an empty string (never `undefined`)", async () => {
    confirmSubscription.mockResolvedValueOnce("invalid");
    expect(await (await post({})).json()).toEqual({ status: "invalid" });
    expect(confirmSubscription).toHaveBeenCalledWith("");
  });
});
