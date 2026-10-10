"use server";

/**
 * Run the admin actions on erasure requests, data requests and the cron — re-authorized
 * and audited.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/monitoring-actions.md
 */

import { audit } from "@/lib/audit";
import { adminId, postApi } from "@/lib/admin-api";

type Fail<E extends string> = {
  ok: false;
  error: "forbidden" | "invalid" | "unreachable" | "failed" | E;
};

export type RetryResult =
  | { ok: true; outcome: "completed" | "partial" }
  | Fail<
      | "email_required"
      | "email_mismatch"
      | "not_retryable"
      | "clerk_failed"
      | "clerk_email_changed"
      | "clerk_unavailable"
      | "unavailable"
      | "changed"
      | "not_found"
    >;
export type CloseResult = { ok: true } | Fail<"note_required" | "not_open" | "not_found">;
export type DataRequestStatusResult =
  | { ok: true; notified: boolean }
  | Fail<"note_required" | "not_allowed" | "changed" | "not_found">;
export type RunResult =
  { ok: true; status: "ok" | "failed" } | Fail<"cron_unbound" | "cron_unreachable">;

const validId = (id: number) => Number.isInteger(id) && id > 0;

/** Retry a stuck (`confirmed`) erasure. The email is optional: the api reads it from Clerk when
 *  it can and answers `email_required` otherwise; a typed email is never stored. */
export async function retryErasure(id: number, email?: string): Promise<RetryResult> {
  const actor = await adminId();
  if (!actor) return { ok: false, error: "forbidden" };
  if (!validId(id)) return { ok: false, error: "invalid" };
  const typed = email?.trim();
  const res = await postApi(
    `/v1/erasure-requests/${id}/retry`,
    typed ? { email: typed } : {},
  );
  await audit("admin.erasure_retry", { actor, target: `erasure:${id}` });
  if (!res) return { ok: false, error: "unreachable" };
  if (res.status === 200) return { ok: true, outcome: "completed" };
  if (res.status === 207) return { ok: true, outcome: "partial" };
  if (res.status === 502) return { ok: false, error: "clerk_failed" };
  const known = [
    "email_required",
    "email_mismatch",
    "not_retryable",
    "clerk_email_changed",
    "clerk_unavailable",
    "unavailable",
    "changed",
    "not_found",
  ] as const;
  const error = known.find((k) => k === res.data.error);
  return { ok: false, error: error ?? "failed" };
}

/** Close an open request handled outside the system — the note is required (5–500 chars). */
export async function closeErasure(id: number, note: string): Promise<CloseResult> {
  const actor = await adminId();
  if (!actor) return { ok: false, error: "forbidden" };
  if (!validId(id)) return { ok: false, error: "invalid" };
  const text = note.trim();
  if (text.length < 5 || text.length > 500) return { ok: false, error: "note_required" };
  const res = await postApi(`/v1/erasure-requests/${id}/close`, {
    note: text,
    by: actor,
  });
  await audit("admin.erasure_close", { actor, target: `erasure:${id}` });
  if (!res) return { ok: false, error: "unreachable" };
  if (res.status === 200) return { ok: true };
  const known = ["note_required", "not_open", "not_found"] as const;
  const error = known.find((k) => k === res.data.error);
  return { ok: false, error: error ?? "failed" };
}

/** Run one cron tick now (the api reaches the cron over a private service binding). */
export async function runCronNow(): Promise<RunResult> {
  const actor = await adminId();
  if (!actor) return { ok: false, error: "forbidden" };
  const res = await postApi("/v1/cron/run");
  await audit("admin.cron_run", { actor, target: "cron" });
  if (!res) return { ok: false, error: "unreachable" };
  if (res.data.error === "cron_unbound" || res.data.error === "cron_unreachable")
    return { ok: false, error: res.data.error };
  if (res.data.status === "ok" || res.data.status === "failed")
    return { ok: true, status: res.data.status };
  return { ok: false, error: "failed" };
}

/** Move a data request (`from` = the status the operator saw, so a concurrent change is
 *  refused). Closing with `notify` emails the note to the requester, api-side. */
export async function setDataRequestStatus(
  id: number,
  from: string,
  status: string,
  note: string,
  notify: boolean,
): Promise<DataRequestStatusResult> {
  const actor = await adminId();
  if (!actor) return { ok: false, error: "forbidden" };
  if (!validId(id)) return { ok: false, error: "invalid" };
  const text = note.trim();
  if (notify && !text) return { ok: false, error: "note_required" };
  if (text.length > 4000) return { ok: false, error: "invalid" };
  const res = await postApi(`/v1/data-requests/${id}/status`, {
    status,
    from,
    note: text,
    notify,
    by: actor,
  });
  await audit("admin.data_request_status", {
    actor,
    target: `data-request:${id}`,
  });
  if (!res) return { ok: false, error: "unreachable" };
  if (res.status === 200) return { ok: true, notified: res.data.notified === true };
  const known = [
    "note_required",
    "not_allowed",
    "changed",
    "not_found",
    "invalid",
  ] as const;
  const error = known.find((k) => k === res.data.error);
  return { ok: false, error: error ?? "failed" };
}
