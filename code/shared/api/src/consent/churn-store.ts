export const CHURN_REASONS = [
  "too_expensive",
  "not_using",
  "missing_feature",
  "found_alternative",
  "too_hard",
  "privacy",
  "other",
] as const;
export type ChurnReason = (typeof CHURN_REASONS)[number];

export type ChurnSurvey = {
  reason?: string | null;
  feedback?: string | null;
  competitor?: string | null;
};

/** A value iff it is a known preset reason code; anything else → null (never trust the client). */
export function normalizeReason(value: unknown): string | null {
  return typeof value === "string" &&
    (CHURN_REASONS as readonly string[]).includes(value)
    ? value
    : null;
}

const clip = (v: unknown, max: number): string | null => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, max) : null;
};

/** One row per departed user. INSERT OR REPLACE — a re-submit overwrites, never duplicates. */
export async function writeChurnEvent(
  db: D1Database,
  userId: string,
  survey: ChurnSurvey,
  ts: string,
): Promise<void> {
  await db
    .prepare(
      "INSERT OR REPLACE INTO churn_events (user_id, deleted_at, reason, feedback, competitor) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(
      userId,
      ts,
      normalizeReason(survey.reason),
      clip(survey.feedback, 4000),
      clip(survey.competitor, 200),
    )
    .run();
}

/** Existence + reason for the webhook's suppress-vs-delete branch. null → no churn row. */
export async function readChurnEvent(
  db: D1Database,
  userId: string,
): Promise<{ reason: string | null } | null> {
  const row = await db
    .prepare("SELECT reason FROM churn_events WHERE user_id = ?")
    .bind(userId)
    .first<{ reason: string | null }>();
  return row ? { reason: row.reason ?? null } : null;
}

export type ChurnAggregate = {
  total: number;
  byDay: { date: string; count: number }[];
  byReason: { reason: string; count: number }[];
  recentFeedback: {
    deleted_at: string;
    reason: string | null;
    feedback: string | null;
    competitor: string | null;
  }[];
};

/** Pure COUNT…GROUP BY — no per-row scan of the whole table into the worker. */
export async function readChurnAggregate(
  db: D1Database,
): Promise<ChurnAggregate> {
  const total =
    (
      await db
        .prepare("SELECT COUNT(*) c FROM churn_events")
        .first<{ c: number }>()
    )?.c ?? 0;
  const byDay = (
    await db
      .prepare(
        "SELECT substr(deleted_at,1,10) date, COUNT(*) count FROM churn_events GROUP BY date ORDER BY date DESC LIMIT 90",
      )
      .all<{ date: string; count: number }>()
  ).results;
  const byReason = (
    await db
      .prepare(
        "SELECT COALESCE(reason,'unknown') reason, COUNT(*) count FROM churn_events GROUP BY reason ORDER BY count DESC",
      )
      .all<{ reason: string; count: number }>()
  ).results;
  const recentFeedback = (
    await db
      .prepare(
        "SELECT deleted_at, reason, feedback, competitor FROM churn_events WHERE feedback IS NOT NULL OR competitor IS NOT NULL ORDER BY deleted_at DESC LIMIT 50",
      )
      .all<{
        deleted_at: string;
        reason: string | null;
        feedback: string | null;
        competitor: string | null;
      }>()
  ).results;
  return { total, byDay, byReason, recentFeedback };
}
