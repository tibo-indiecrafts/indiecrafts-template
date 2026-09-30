/**
 * Build the admin monitoring payloads: cron run health and open erasure requests by deadline.
 *
 * @see docs/reference/shared/api/src/monitoring.md
 */

/** The cron runs hourly (`[triggers] crons = ["0 * * * *"]`) — two missed ticks = stale. */
export const STALE_AFTER_MS = 2 * 60 * 60 * 1000;

type Bindings = { AUDIT_DB?: D1Database; MAIN_DB?: D1Database };

export type ErasureState = "breached" | "dueSoon" | "onTrack" | "closed";

/** Open = the engine still owes this request an outcome: confirmed, or awaiting confirmation
 *  with a live link. `?1` = now. Same definition as the cron's erasure_sla pass. */
const OPEN =
  "(status = 'confirmed' OR (status IN ('pending','email_sent') AND token_expires_at >= ?1))";

const DAY_MS = 86_400_000;

export function erasureState(
  status: string,
  dueAt: string,
  tokenExpiresAt: string,
  nowIso: string,
  dueSoonIso: string,
): ErasureState {
  const open =
    status === "confirmed" ||
    ((status === "pending" || status === "email_sent") &&
      tokenExpiresAt >= nowIso);
  if (!open) return "closed";
  if (dueAt < nowIso) return "breached";
  return dueAt < dueSoonIso ? "dueSoon" : "onTrack";
}

const count = async (db: D1Database, sql: string, ...binds: unknown[]) =>
  (
    await db
      .prepare(sql)
      .bind(...binds)
      .first<{ n: number }>()
  )?.n ?? 0;

/** `GET /v1/cron/status` — the last day of runs, a stale flag, and live erasure/export counts
 *  (read from the main D1, so they stay true even if the cron is down). */
export async function cronStatus(env: Bindings, now: number, warnDays: number) {
  const nowIso = new Date(now).toISOString();
  const soonIso = new Date(now + warnDays * DAY_MS).toISOString();

  let runs: {
    startedAt: string;
    finishedAt: string;
    status: string;
    passes: unknown[];
  }[] = [];
  if (env.AUDIT_DB) {
    const { results } = await env.AUDIT_DB.prepare(
      "SELECT started_at, finished_at, status, passes FROM cron_runs ORDER BY started_at DESC LIMIT 24",
    ).all<{
      started_at: string;
      finished_at: string;
      status: string;
      passes: string;
    }>();
    runs = results.map((r) => ({
      startedAt: r.started_at,
      finishedAt: r.finished_at,
      status: r.status,
      passes: JSON.parse(r.passes) as unknown[],
    }));
  }

  const erasure = { open: 0, dueSoon: 0, breached: 0 };
  const exports = { outstanding: 0, expiredUnswept: 0 };
  if (env.MAIN_DB) {
    const db = env.MAIN_DB;
    erasure.open = await count(
      db,
      `SELECT COUNT(*) AS n FROM erasure_requests WHERE ${OPEN}`,
      nowIso,
    );
    erasure.breached = await count(
      db,
      `SELECT COUNT(*) AS n FROM erasure_requests WHERE ${OPEN} AND due_at < ?1`,
      nowIso,
    );
    erasure.dueSoon = await count(
      db,
      `SELECT COUNT(*) AS n FROM erasure_requests WHERE ${OPEN} AND due_at >= ?1 AND due_at < ?2`,
      nowIso,
      soonIso,
    );
    exports.outstanding = await count(
      db,
      "SELECT COUNT(*) AS n FROM export_requests WHERE expires_at >= ?",
      nowIso,
    );
    exports.expiredUnswept = await count(
      db,
      "SELECT COUNT(*) AS n FROM export_requests WHERE expires_at < ?",
      nowIso,
    );
  }

  const lastRunAt = runs[0]?.startedAt ?? null;
  const stale = !lastRunAt || now - Date.parse(lastRunAt) > STALE_AFTER_MS;
  return { lastRunAt, stale, runs, erasure, exports };
}

type ErasureRow = {
  id: number;
  status: string;
  requested_at: string;
  due_at: string;
  token_expires_at: string;
  due_flagged_at: string | null;
  breach_flagged_at: string | null;
};

/** Explicit columns — never email_fingerprint / user_id: the view monitors the deadline,
 *  the erasure engine does the work. */
const ERASURE_COLS =
  "id, status, requested_at, due_at, token_expires_at, due_flagged_at, breach_flagged_at";

/** `GET /v1/erasure-requests` — open requests by deadline (soonest first) + the 20 most
 *  recently requested closed ones. */
export async function erasureRequests(
  env: Bindings,
  now: number,
  warnDays: number,
) {
  if (!env.MAIN_DB) return { open: [], recentClosed: [] };
  const nowIso = new Date(now).toISOString();
  const soonIso = new Date(now + warnDays * DAY_MS).toISOString();
  const view = (r: ErasureRow) => ({
    id: r.id,
    status: r.status,
    requestedAt: r.requested_at,
    dueAt: r.due_at,
    state: erasureState(
      r.status,
      r.due_at,
      r.token_expires_at,
      nowIso,
      soonIso,
    ),
    dueFlaggedAt: r.due_flagged_at,
    breachFlaggedAt: r.breach_flagged_at,
  });
  const open = await env.MAIN_DB.prepare(
    `SELECT ${ERASURE_COLS} FROM erasure_requests WHERE ${OPEN} ORDER BY due_at ASC LIMIT 200`,
  )
    .bind(nowIso)
    .all<ErasureRow>();
  const closed = await env.MAIN_DB.prepare(
    `SELECT ${ERASURE_COLS} FROM erasure_requests WHERE NOT ${OPEN} ORDER BY requested_at DESC LIMIT 20`,
  )
    .bind(nowIso)
    .all<ErasureRow>();
  return {
    open: open.results.map(view),
    recentClosed: closed.results.map(view),
  };
}
