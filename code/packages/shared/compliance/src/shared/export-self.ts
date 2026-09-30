/**
 * Runs the authenticated data-export POST and resolves a download URL.
 *
 * @see docs/reference/packages/shared/compliance/src/shared/export-self.md
 */

import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

export type ExportResult = { ok: true; url: string } | { ok: false };

/**
 * Pure, testable: the one authenticated POST to the Slice-2 export worker route.
 */
export async function requestExport(input: {
  apiUrl: string;
  getToken: () => Promise<string | null>;
}): Promise<ExportResult> {
  try {
    const token = await input.getToken();
    const res = await apiFetch(`${input.apiUrl}/v1/export`, {
      method: "POST",
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.status !== 200) return { ok: false };
    const body = (await res.json()) as { downloadUrl?: unknown };
    return typeof body.downloadUrl === "string"
      ? { ok: true, url: body.downloadUrl }
      : { ok: false };
  } catch {
    return { ok: false };
  }
}
