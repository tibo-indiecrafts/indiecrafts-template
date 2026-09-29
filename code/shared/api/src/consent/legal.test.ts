import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { handleLegalConsent } from "./legal";

const ENV = { ...env, CLERK_SECRET_KEY: "sk_test" } as typeof env;
const authOK = async () => "user_lc";
const authFail = async () => null;

async function seed() {
  await ENV.MAIN_DB!.prepare(
    "INSERT OR IGNORE INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind("user_lc", "lc@x.com", "fp_lc", new Date().toISOString())
    .run();
}
const get = () => new Request("https://x/v1/consent/legal", { method: "GET" });
const post = (version: string) =>
  new Request("https://x/v1/consent/legal", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ version, surface: "mobile" }),
  });

describe("GET/POST /v1/consent/legal", () => {
  it("401s when the JWT does not verify", async () => {
    const res = await handleLegalConsent(get(), ENV, undefined, authFail);
    expect(res.status).toBe(401);
  });

  it("GET returns null before any acceptance", async () => {
    await seed();
    const res = await handleLegalConsent(get(), ENV, undefined, authOK);
    expect(await res.json()).toEqual({ legal_acked_version: null });
  });

  it("POST records the version + proof, and GET reads it back", async () => {
    await seed();
    const res = await handleLegalConsent(
      post("2026-01·priv1"),
      ENV,
      undefined,
      authOK,
    );
    expect(await res.json()).toEqual({ ok: true });

    const back = await handleLegalConsent(get(), ENV, undefined, authOK);
    expect(await back.json()).toEqual({ legal_acked_version: "2026-01·priv1" });

    const proof = await ENV.MAIN_DB!.prepare(
      "SELECT policy_version, granted FROM consent_events WHERE subject_id = ? AND consent_type = 'legal_reaccept'",
    )
      .bind("user_lc")
      .all<{ policy_version: string; granted: number }>();
    expect(proof.results).toHaveLength(1);
    expect(proof.results[0]).toMatchObject({
      policy_version: "2026-01·priv1",
      granted: 1,
    });
  });

  it("re-accepting the same version is idempotent (one proof row)", async () => {
    await seed();
    await handleLegalConsent(post("v-dup"), ENV, undefined, authOK);
    await handleLegalConsent(post("v-dup"), ENV, undefined, authOK);
    const proof = await ENV.MAIN_DB!.prepare(
      "SELECT COUNT(*) AS n FROM consent_events WHERE subject_id = ? AND policy_version = 'v-dup'",
    )
      .bind("user_lc")
      .first<{ n: number }>();
    expect(proof?.n).toBe(1);
  });

  it("400s on a missing version", async () => {
    await seed();
    const bad = new Request("https://x/v1/consent/legal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ surface: "app" }),
    });
    const res = await handleLegalConsent(bad, ENV, undefined, authOK);
    expect(res.status).toBe(400);
  });
});
