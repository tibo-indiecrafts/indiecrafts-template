/**
 * Forward a consent decision to the shared api, server-side.
 *
 * @see docs/reference/packages/web/compliance/src/consent-log.md
 */
import "server-only";
import { apiFetch } from "@indiecrafts/packages-shared-utils/api-fetch";

/** Forward one consent decision to the api's POST /v1/events (kind:consent).
 *  Server-only: holds APP_API_TOKEN and never runs in the browser. Fire-and-forget
 *  — a failed forward never breaks the caller. The api resolves the email
 *  fingerprint from user_profiles; the email itself is never sent. */
export async function logConsent(input: {
  userId: string | null;
  consentId: string | null;
  events: Array<{ type: string; granted: boolean }>;
  version: string;
  source?: string;
  surface: string;
  country?: string | null;
  decisionId: string;
}): Promise<void> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return;
  try {
    await apiFetch(`${url}/v1/events`, {
      method: "POST",
      idempotent: true,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        kind: "consent",
        userId: input.userId ?? undefined,
        consentId: input.consentId ?? undefined,
        events: input.events,
        policyVersion: input.version,
        source: input.source,
        surface: input.surface.slice(0, 16),
        country: input.country ?? undefined,
        decisionId: input.decisionId,
      }),
    });
  } catch {
    // fire-and-forget
  }
}
