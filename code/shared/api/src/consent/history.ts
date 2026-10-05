/**
 * Reads one user's consent decisions for the admin: current state + timeline.
 *
 * @see docs/reference/shared/api/src/consent/history.md
 */

/** A Clerk user id — the only subject the admin view looks up. */
export const USER_ID = /^user_[A-Za-z0-9]{10,40}$/;

export type ConsentDecision = {
  ts: string;
  type: string;
  granted: boolean;
  policyVersion: string;
  surface: string;
  source: string | null;
  country: string | null;
};

type Row = {
  ts: string;
  consent_type: string;
  granted: number;
  policy_version: string;
  surface: string;
  source: string | null;
  country: string | null;
};

const toDecision = (r: Row): ConsentDecision => ({
  ts: r.ts,
  type: r.consent_type,
  granted: r.granted === 1,
  policyVersion: r.policy_version,
  surface: r.surface,
  source: r.source,
  country: r.country,
});

/** Data-minimized projection — never `ip_hash` or `email_fingerprint`. */
const COLUMNS =
  "ts, consent_type, granted, policy_version, surface, source, country";

/**
 * `current` — the latest decision per consent type (cookie categories, commercial email,
 * each email category, legal re-acceptance), sorted by type. `events` — the last
 * `limit` decisions, newest first. Read-only over the append-only `consent_events` proof
 * log; a user with no decision gets two empty lists.
 */
export async function readConsentHistory(
  db: D1Database,
  userId: string,
  limit = 100,
): Promise<{ current: ConsentDecision[]; events: ConsentDecision[] }> {
  const [latest, recent] = await Promise.all([
    db
      .prepare(
        `SELECT ${COLUMNS} FROM consent_events c WHERE subject_type = 'user' AND subject_id = ?1 ` +
          "AND id = (SELECT id FROM consent_events WHERE subject_type = 'user' AND subject_id = ?1 " +
          "AND consent_type = c.consent_type ORDER BY ts DESC, id DESC LIMIT 1) ORDER BY consent_type",
      )
      .bind(userId)
      .all<Row>(),
    db
      .prepare(
        `SELECT ${COLUMNS} FROM consent_events WHERE subject_type = 'user' AND subject_id = ? ORDER BY ts DESC, id DESC LIMIT ?`,
      )
      .bind(userId, limit)
      .all<Row>(),
  ]);
  return {
    current: latest.results.map(toDecision),
    events: recent.results.map(toDecision),
  };
}
