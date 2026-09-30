/**
 * Record a privileged admin action to the shared audit sink.
 *
 * @see docs/reference/projects/web/admin/src/lib/audit.md
 */
import "server-only";
import { headers } from "next/headers";

/**
 * Admin audit sink — POST each privileged action to the shared api's `/v1/events`,
 * which writes the EU D1 (`admin_audit`). Bearer-gated (`APP_API_TOKEN`). Country is
 * the admin's edge country (`cf-ipcountry`, trusted first-party); no IP is stored for
 * admin actions — the userId is the identity (GDPR data minimization).
 *
 * Fire-and-forget with a DURABLE fallback: if the api is unreachable, log one
 * structured line so the event still reaches Cloudflare Workers Logs — an audit is
 * never silently lost. The admin action itself never fails on an audit hiccup.
 */
export async function audit(
  event:
    | "admin.grant"
    | "admin.revoke"
    | "admin.revoke_session"
    | "admin.revoke_user_sessions"
    | "admin.erasure_retry"
    | "admin.erasure_close"
    | "admin.cron_run",
  fields: { actor: string; target: string },
): Promise<void> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  const country = (await headers()).get("cf-ipcountry") ?? undefined;
  const payload = {
    kind: "admin" as const,
    event,
    actorUserId: fields.actor,
    targetUserId: fields.target,
    country,
  };

  if (url && token) {
    try {
      const res = await fetch(`${url}/v1/events`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) return;
    } catch {
      // fall through to the durable console fallback
    }
  }
  console.log(
    JSON.stringify({ audit: true, ...payload, ts: new Date().toISOString() }),
  );
}
