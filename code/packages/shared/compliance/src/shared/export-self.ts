/**
 * Runs the authenticated data-export POST and resolves a download URL.
 *
 * @see docs/reference/packages/shared/compliance/src/shared/export-self.md
 */

import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

export type ExportResult = { ok: true; url: string } | { ok: false };

/** What `rawExportFetch` resolves to: the status (+ the url on a 200), or Clerk's
 *  reverification hint body (`{ clerk_error: … }`) verbatim on a 403. */
export type ExportFetchOutcome =
  { status: number; downloadUrl?: string } | object;

/**
 * The export POST, shaped for Clerk's `useReverification`: it resolves a plain value (never a
 * `Response`, which the hook would auto-`.json()`), and on a 403 it hands back Clerk's
 * reverification hint so the hook opens the step-up prompt and retries with a fresh token.
 * Same contract as `rawErasureFetch` (erasure-self.ts).
 */
export async function rawExportFetch(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
}): Promise<ExportFetchOutcome> {
  const token = await input.getToken();
  // Not `idempotent`: the answer holds a live download link the api never stores, and the
  // browser preflight would reject an Idempotency-Key header. apiFetch still times out.
  const res = await apiFetch(`${input.apiUrl}/v1/export`, {
    method: "POST",
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 403) {
    const body: unknown = await res.json().catch(() => null);
    if (body !== null && typeof body === "object" && "clerk_error" in body)
      return body;
    return { status: 403 };
  }
  if (res.status !== 200) return { status: res.status };
  const body = (await res.json().catch(() => ({}))) as {
    downloadUrl?: unknown;
  };
  return typeof body.downloadUrl === "string"
    ? { status: 200, downloadUrl: body.downloadUrl }
    : { status: 200 };
}

/** The outcome → `ExportResult` mapping, shared by `requestExport` and a surface's
 *  step-up wrapper. One source of the mapping — do not duplicate it. */
export function mapExportResponse(outcome: ExportFetchOutcome): ExportResult {
  if (
    "status" in outcome &&
    outcome.status === 200 &&
    "downloadUrl" in outcome &&
    typeof outcome.downloadUrl === "string"
  )
    return { ok: true, url: outcome.downloadUrl };
  return { ok: false };
}

/**
 * Pure, testable: the default (no step-up) export. A surface with Clerk reverification
 * injects its own `submitExport` built from `rawExportFetch` + `mapExportResponse`.
 */
export async function requestExport(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
}): Promise<ExportResult> {
  try {
    return mapExportResponse(await rawExportFetch(input));
  } catch {
    return { ok: false };
  }
}
