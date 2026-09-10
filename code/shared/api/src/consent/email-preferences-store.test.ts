import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import {
  readPreferences,
  recomputeMarketingEmail,
  writePreferences,
} from "./email-preferences-store";

const db = () => env.MAIN_DB!;

async function seedUser(userId: string) {
  await db()
    .prepare(
      "INSERT OR IGNORE INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
    )
    .bind(userId, `${userId}@x.com`, `fp_${userId}`, new Date().toISOString())
    .run();
}

describe("writePreferences / readPreferences / recomputeMarketingEmail", () => {
  it("writes state rows, one proof row per change, and sets marketing_email", async () => {
    await seedUser("user_ep1");

    await writePreferences(db(), {
      userId: "user_ep1",
      fingerprint: "fp_user_ep1",
      updates: [
        { key: "news", granted: true },
        { key: "offers", granted: false },
      ],
      surface: "account",
      country: "FR",
      marketingKeys: ["news"],
    });

    const prefs = await readPreferences(db(), "user_ep1");
    expect(prefs).toEqual({ news: true, offers: false });

    const newsProof = await db()
      .prepare(
        "SELECT granted, source, surface, country, email_fingerprint FROM consent_events WHERE subject_id = ? AND consent_type = 'email_pref:news'",
      )
      .bind("user_ep1")
      .first<{
        granted: number;
        source: string;
        surface: string;
        country: string;
        email_fingerprint: string;
      }>();
    expect(newsProof?.granted).toBe(1);
    expect(newsProof?.source).toBe("account");
    expect(newsProof?.surface).toBe("account");
    expect(newsProof?.country).toBe("FR");
    expect(newsProof?.email_fingerprint).toBe("fp_user_ep1");

    const offersProof = await db()
      .prepare(
        "SELECT granted FROM consent_events WHERE subject_id = ? AND consent_type = 'email_pref:offers'",
      )
      .bind("user_ep1")
      .first<{ granted: number }>();
    expect(offersProof?.granted).toBe(0);

    const profile = await db()
      .prepare("SELECT marketing_email FROM user_profiles WHERE user_id = ?")
      .bind("user_ep1")
      .first<{ marketing_email: number }>();
    expect(profile?.marketing_email).toBe(1);

    // Flip news off — marketing_email should drop to 0.
    await writePreferences(db(), {
      userId: "user_ep1",
      fingerprint: "fp_user_ep1",
      updates: [{ key: "news", granted: false }],
      surface: "account",
      country: "FR",
      marketingKeys: ["news"],
    });

    const prefsAfter = await readPreferences(db(), "user_ep1");
    expect(prefsAfter).toEqual({ news: false, offers: false });

    const profileAfter = await db()
      .prepare("SELECT marketing_email FROM user_profiles WHERE user_id = ?")
      .bind("user_ep1")
      .first<{ marketing_email: number }>();
    expect(profileAfter?.marketing_email).toBe(0);
  });

  it("recomputeMarketingEmail sets 0 when marketingKeys is empty", async () => {
    await seedUser("user_ep2");
    await writePreferences(db(), {
      userId: "user_ep2",
      fingerprint: "fp_user_ep2",
      updates: [{ key: "news", granted: true }],
      surface: "account",
      country: null,
      marketingKeys: ["news"],
    });

    await recomputeMarketingEmail(db(), "user_ep2", []);

    const profile = await db()
      .prepare("SELECT marketing_email FROM user_profiles WHERE user_id = ?")
      .bind("user_ep2")
      .first<{ marketing_email: number }>();
    expect(profile?.marketing_email).toBe(0);
  });

  it("readPreferences returns {} for a user with no rows", async () => {
    await seedUser("user_ep3");
    expect(await readPreferences(db(), "user_ep3")).toEqual({});
  });
});
