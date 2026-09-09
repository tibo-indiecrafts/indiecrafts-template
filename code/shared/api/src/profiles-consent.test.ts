import { env, SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

const auth = {
  authorization: "Bearer test-token",
  "content-type": "application/json",
};

describe("POST /v1/profiles/consent (bearer batch)", () => {
  it("401s without the bearer", async () => {
    const res = await SELF.fetch("https://api.test/v1/profiles/consent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userIds: ["u1"] }),
    });
    expect(res.status).toBe(401);
  });

  it("returns marketing_email per id; an unknown id resolves to null", async () => {
    const now = new Date().toISOString();
    await env
      .MAIN_DB!.prepare(
        "INSERT OR IGNORE INTO user_profiles (user_id, marketing_email, created_at) VALUES (?, ?, ?)",
      )
      .bind("pc_in", 1, now)
      .run();
    await env
      .MAIN_DB!.prepare(
        "INSERT OR IGNORE INTO user_profiles (user_id, marketing_email, created_at) VALUES (?, ?, ?)",
      )
      .bind("pc_out", 0, now)
      .run();
    const res = await SELF.fetch("https://api.test/v1/profiles/consent", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ userIds: ["pc_in", "pc_out", "pc_missing"] }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ pc_in: 1, pc_out: 0, pc_missing: null });
  });

  it("400s an empty id list", async () => {
    const res = await SELF.fetch("https://api.test/v1/profiles/consent", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ userIds: [] }),
    });
    expect(res.status).toBe(400);
  });
});
