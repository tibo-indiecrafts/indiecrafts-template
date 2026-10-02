/**
 * Log a signed-in user's cookie-consent decision.
 *
 * @see docs/reference/projects/web/app/src/app/api/consent-log/route.md
 */
import { auth } from "@clerk/nextjs/server";
import { logConsent } from "@indiecrafts/packages-shared-compliance/server/consent-log";
import { clientIp } from "@indiecrafts/packages-shared-security/guard";

type Body = {
  events?: Array<{ type: string; granted: boolean }>;
  version?: string;
  source?: string;
  decisionId?: string;
};

/**
 * Same-origin consent logger — `reportConsent` POSTs here with no userId; the user comes
 * from Clerk `auth()` server-side (the trust boundary). Account-scoped only: the app has
 * no anonymous-logging flag, so a signed-out decision stays local (204, nothing written).
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new Response(null, { status: 204 });
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > 4000)
    return new Response(null, { status: 413 });
  let body: Body;
  try {
    body = JSON.parse(raw) as Body;
  } catch {
    body = {};
  }
  if (!Array.isArray(body.events) || !body.version || !body.decisionId)
    return new Response(null, { status: 400 });

  await logConsent({
    userId,
    consentId: null,
    events: body.events,
    version: body.version,
    source: typeof body.source === "string" ? body.source : undefined,
    surface: "app",
    country: request.headers.get("cf-ipcountry"),
    decisionId: body.decisionId,
    clientIp: clientIp(request),
  });
  return new Response(null, { status: 204 });
}
