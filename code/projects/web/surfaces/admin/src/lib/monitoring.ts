/**
 * Read the api's monitoring payloads server-side and derive the cron health badge.
 *
 * @see docs/reference/projects/web/admin/src/lib/monitoring.md
 */

import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

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
export type ErasureRequests = {
  open: ErasureRow[];
  recentClosed: ErasureRow[];
};

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
    const res = await apiFetch(`${url}${path}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export const fetchCronStatus = () => getApi<CronStatus>("/v1/cron/status");

/** One GDPR data-subject request, as `GET /v1/data-requests` returns it (decrypted). */
export type DataRequestRow = {
  id: number;
  request_type: string;
  email: string;
  message: string | null;
  /** `new | in-progress | done` (the api's `data_requests` schema). */
  status: string;
  submitted_at: string;
  source: string | null;
  locale: string | null;
};

/** The newest 100 requests. `null` = could not load — never shown as "no requests". */
export async function fetchDataRequests(): Promise<DataRequestRow[] | null> {
  const body = await getApi<{ data?: DataRequestRow[] }>("/v1/data-requests?limit=100");
  return body ? (body.data ?? []) : null;
}
export const fetchErasureRequests = () =>
  getApi<ErasureRequests>("/v1/erasure-requests");

/** The api's authed `/health` body, flattened for the System page. No body (api down, or the
 *  bearer is not set) → dashes and empty lists, never a crash. */
export type ApiHealthView = {
  version: string;
  commit: string;
  dbs: { key: "audit" | "main"; status: string }[];
  bindings: { key: string; bound: boolean }[];
};
export function apiHealthView(body?: Record<string, unknown>): ApiHealthView {
  if (!body) return { version: "—", commit: "—", dbs: [], bindings: [] };
  const db = (body.db ?? {}) as Record<string, unknown>;
  const bindings = (body.bindings ?? {}) as Record<string, unknown>;
  return {
    version: String(body.version ?? "—"),
    commit: String(body.commit ?? "—"),
    dbs: (["audit", "main"] as const).map((key) => ({
      key,
      status: String(db[key] ?? "unknown"),
    })),
    bindings: Object.entries(bindings).map(([key, v]) => ({
      key,
      bound: v === "bound",
    })),
  };
}
