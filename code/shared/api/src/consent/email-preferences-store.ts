// Email-preferences D1 store — pure read/write layer for per-category marketing opt-ins.
// State lives in email_preferences (one row per user per category, migration 0009); each
// write also appends an append-only consent_events proof row (same idiom as marketing.ts)
// and recomputes the derived user_profiles.marketing_email cache used by the Resend sync
// and the legacy single-flag readers.

/** `{ [category_key]: granted }` for a user, from email_preferences. */
export async function readPreferences(
  db: D1Database,
  userId: string,
): Promise<Record<string, boolean>> {
  const { results } = await db
    .prepare(
      "SELECT category_key, granted FROM email_preferences WHERE user_id = ?",
    )
    .bind(userId)
    .all<{ category_key: string; granted: number }>();
  const prefs: Record<string, boolean> = {};
  for (const row of results) prefs[row.category_key] = row.granted === 1;
  return prefs;
}

/** Sets user_profiles.marketing_email = 1 iff any of `marketingKeys` is granted. */
export async function recomputeMarketingEmail(
  db: D1Database,
  userId: string,
  marketingKeys: string[],
): Promise<void> {
  if (marketingKeys.length === 0) {
    await db
      .prepare("UPDATE user_profiles SET marketing_email = 0 WHERE user_id = ?")
      .bind(userId)
      .run();
    return;
  }
  const placeholders = marketingKeys.map(() => "?").join(", ");
  await db
    .prepare(
      `UPDATE user_profiles SET marketing_email = (SELECT CASE WHEN EXISTS(SELECT 1 FROM email_preferences WHERE user_id = ? AND granted = 1 AND category_key IN (${placeholders})) THEN 1 ELSE 0 END) WHERE user_id = ?`,
    )
    .bind(userId, ...marketingKeys, userId)
    .run();
}

/** Upserts each preference, appends one append-only consent_events proof row per change,
 *  then recomputes the derived marketing_email cache. */
export async function writePreferences(
  db: D1Database,
  opts: {
    userId: string;
    fingerprint: string | null;
    updates: { key: string; granted: boolean }[];
    surface: string;
    country: string | null;
    marketingKeys: string[];
  },
): Promise<void> {
  const { userId, fingerprint, updates, surface, country, marketingKeys } =
    opts;
  const now = new Date().toISOString();
  if (updates.length > 0) {
    // Batched: each pref row and its proof row must commit together, and one failed
    // update must not partially land while a sibling key's pair does.
    const statements = updates.flatMap(({ key, granted }) => [
      db
        .prepare(
          "INSERT OR REPLACE INTO email_preferences (user_id, category_key, granted, updated_at) VALUES (?, ?, ?, ?)",
        )
        .bind(userId, key, granted ? 1 : 0, now),
      // Append-only proof (keyed by fingerprint, never raw email) — mirrors the
      // consent_events INSERT shape in consent/marketing.ts.
      db
        .prepare(
          "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key) " +
            "VALUES (?, 'user', ?, ?, ?, ?, '1', ?, 'account', ?, NULL, ?)",
        )
        .bind(
          now,
          userId,
          fingerprint,
          `email_pref:${key}`,
          granted ? 1 : 0,
          surface,
          country,
          `account:${userId}:${now}:${key}`,
        ),
    ]);
    await db.batch(statements);
  }
  await recomputeMarketingEmail(db, userId, marketingKeys);
}
