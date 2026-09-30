/**
 * Read the api's monitoring payloads server-side and derive the cron health badge.
 *
 * @see docs/reference/projects/web/admin/src/lib/monitoring.md
 */

/** One cron pass — mirrors `PassResult` in `code/shared/cron/src/index.ts`. */
export type PassResult = {
  name: string;
  status: "ok" | "failed" | "skipped";
  counts: Record<string, number>;
  reason?: string;
  error?: string;
};

export type CronRun = {
  startedAt: string;
  finishedAt: string;
  status: "ok" | "failed";
  passes: PassResult[];
};

/** `GET /v1/cron/status` — see `code/shared/api/src/monitoring.ts`. */
export type CronStatus = {
  lastRunAt: string | null;
  stale: boolean;
  runs: CronRun[];
  erasure: { open: number; dueSoon: number; breached: number };
  exports: { outstanding: number; expiredUnswept: number };
};

export type ErasureRow = {
  id: number;
  status: string;
  requestedAt: string;
  dueAt: string;
  state: "breached" | "dueSoon" | "onTrack" | "closed";
  dueFlaggedAt: string | null;
  breachFlaggedAt: string | null;
  /** The operator's note when closed by hand ("Close manually"). */
  note: string | null;
};

/** `GET /v1/erasure-requests` — no identifiers, by design. */
export type ErasureRequests = { open: ErasureRow[]; recentClosed: ErasureRow[] };

export type CronHealth = "unreachable" | "never" | "stale" | "failed" | "ok";

/** Stale wins over failed: an old failure means the cron stopped, not just that it failed. */
export function cronHealth(status: CronStatus | null): CronHealth {
  if (!status) return "unreachable";
  if (!status.lastRunAt) return "never";
  if (status.stale) return "stale";
  return status.runs[0]?.status === "failed" ? "failed" : "ok";
}

/** Badge variant per health state — every badge also carries its text (never color alone). */
export function healthVariant(
  health: CronHealth,
): "outline" | "secondary" | "destructive" {
  if (health === "ok") return "outline";
  if (health === "never") return "secondary";
  return "destructive";
}

/** GET a bearer-gated api path with the server-side token. `null` = not configured or
 *  unreachable — the page shows that state instead of crashing. */
async function getApi<T>(path: string): Promise<T | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}${path}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export const fetchCronStatus = () => getApi<CronStatus>("/v1/cron/status");
export const fetchErasureRequests = () =>
  getApi<ErasureRequests>("/v1/erasure-requests");
