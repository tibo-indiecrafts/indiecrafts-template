import { describe, it, expect } from "vitest";
import { env } from "cloudflare:test";
import { readSettings } from "./settings-cache";

describe("readSettings", () => {
  it("returns defaults then an override after it is set", async () => {
    const ref = { value: null as null | { at: number; data: Record<string, number> } };
    const a = await readSettings(env.DB, ref, 0); // ttl 0 → always fresh
    expect(a["ttl.export_download_hours"]).toBe(1);
    await env.DB.prepare(
      "INSERT INTO site_settings (key,value,updated_at,updated_by) VALUES ('ttl.export_download_hours','2','t','user_x')",
    ).run();
    const b = await readSettings(env.DB, ref, 0);
    expect(b["ttl.export_download_hours"]).toBe(2);
  });
});
