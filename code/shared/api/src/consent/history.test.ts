import { env, SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

const USER = "user_2abcHISTORYtest0001";

async function seed(
  ts: string,
  type: string,
  granted: 0 | 1,
  extra: { source?: string; surface?: string; id?: string } = {},
) {
  await env.MAIN_DB.prepare(
    "INSERT INTO consent_events (ts, subject_type, subject_id, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key) VALUES (?, 'user', ?, ?, ?, '1', ?, ?, 'FR', 'secret-hash', ?)",
  )
    .bind(
      ts,
      extra.id ?? USER,
      type,
      granted,
      extra.surface ?? "website",
      extra.source ?? "banner",
      `${ts}:${type}:${extra.id ?? USER}`,
    )
    .run();
}

const get = (query: string, auth = true) =>
  SELF.fetch(`https://example.com/v1/consent/history${query}`, {
    headers: auth ? { authorization: "Bearer test-token" } : {},
  });

describe("GET /v1/consent/history (admin)", () => {
  it("returns the latest decision per type + the timeline, newest first, never the IP hash", async () => {
    await seed("2026-10-01T10:00:00Z", "cookie_analytics", 1);
    await seed("2026-10-02T10:00:00Z", "cookie_analytics", 0, {
      source: "preferences",
      surface: "app",
    });
    await seed("2026-10-01T10:00:00Z", "marketing_email", 1);
    await seed("2026-10-03T10:00:00Z", "cookie_analytics", 1, {
      id: "user_someoneElse000001",
    });

    const res = await get(`?userId=${USER}`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      current: { type: string; granted: boolean; source: string | null }[];
      events: { ts: string; type: string }[];
    };
    expect(body.current).toEqual([
      expect.objectContaining({
        type: "cookie_analytics",
        granted: false,
        source: "preferences",
        surface: "app",
      }),
      expect.objectContaining({ type: "marketing_email", granted: true }),
    ]);
    expect(body.events.map((e) => e.ts)).toEqual([
      "2026-10-02T10:00:00Z",
      "2026-10-01T10:00:00Z",
      "2026-10-01T10:00:00Z",
    ]);
    expect(JSON.stringify(body)).not.toContain("secret-hash");
    expect(JSON.stringify(body)).not.toContain("someoneElse");
  });

  it("is admin-only (401) and rejects a malformed user id (400)", async () => {
    expect((await get(`?userId=${USER}`, false)).status).toBe(401);
    expect((await get("?userId=not-a-user")).status).toBe(400);
    expect((await get("")).status).toBe(400);
  });

  it("an unknown user has an empty history", async () => {
    const res = await get("?userId=user_nobodyHere00000001");
    expect(await res.json()).toEqual({ current: [], events: [] });
  });
});
