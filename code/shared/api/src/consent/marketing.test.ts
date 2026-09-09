import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import { handleMarketingConsent } from "./marketing";

const ENV = { ...env, CLERK_SECRET_KEY: "sk_test" } as typeof env;
const authOK = async () => "user_mc";
const authFail = async () => null;

async function seed() {
  await ENV.MAIN_DB!.prepare(
    "INSERT OR IGNORE INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind("user_mc", "mc@x.com", "fp_mc", new Date().toISOString())
    .run();
}

const get = () =>
  new Request("https://x/v1/consent/marketing-email", { method: "GET" });
const post = (granted: boolean) =>
  new Request("https://x/v1/consent/marketing-email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ granted, surface: "app" }),
  });

describe("GET/POST /v1/consent/marketing-email", () => {
  it("401s when the JWT does not verify", async () => {
    const res = await handleMarketingConsent(get(), ENV, undefined, authFail);
    expect(res.status).toBe(401);
  });

  it("GET returns null before any decision", async () => {
    await seed();
    const res = await handleMarketingConsent(get(), ENV, undefined, authOK);
    expect(await res.json()).toEqual({ marketing_email: null });
  });

  it("POST(granted) writes the proof, sets the column, and syncs Resend", async () => {
    await seed();
    const sync = vi.fn(async () => {});
    const res = await handleMarketingConsent(
      post(true),
      ENV,
      undefined,
      authOK,
      sync,
    );
    expect(await res.json()).toEqual({ ok: true });

    const row = await ENV.MAIN_DB!.prepare(
      "SELECT marketing_email FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_mc")
      .first<{ marketing_email: number | null }>();
    expect(row?.marketing_email).toBe(1);

    const proof = await ENV.MAIN_DB!.prepare(
      "SELECT granted, source FROM consent_events WHERE subject_id = ? AND consent_type = 'marketing_email' ORDER BY id DESC",
    )
      .bind("user_mc")
      .first<{ granted: number; source: string }>();
    expect(proof?.granted).toBe(1);
    expect(proof?.source).toBe("account");

    expect(sync).toHaveBeenCalledWith(ENV, {
      email: "mc@x.com",
      granted: true,
    });

    // GET now reflects the stored decision.
    const after = await handleMarketingConsent(get(), ENV, undefined, authOK);
    expect(await after.json()).toEqual({ marketing_email: true });
  });

  it("POST(!granted) sets 0 and unsubscribes in Resend", async () => {
    await seed();
    const sync = vi.fn(async () => {});
    await handleMarketingConsent(post(false), ENV, undefined, authOK, sync);
    const row = await ENV.MAIN_DB!.prepare(
      "SELECT marketing_email FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_mc")
      .first<{ marketing_email: number | null }>();
    expect(row?.marketing_email).toBe(0);
    expect(sync).toHaveBeenCalledWith(ENV, {
      email: "mc@x.com",
      granted: false,
    });
  });
});
