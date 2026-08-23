import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { logConsent } from "@indiecrafts/packages-web-compliance/consent-log";
import { features } from "@/config";

type Body = {
  events?: Array<{ type: string; granted: boolean }>;
  version?: string;
  source?: string;
  decisionId?: string;
};

/**
 * Same-origin consent logger — `reportConsent` POSTs here with no userId, and we
 * resolve it server-side from Clerk `auth()` (the trust boundary). Anonymous visitors
 * are logged only when `features.compliance.logAnonymousConsent` is on, keyed by a
 * first-party `consent_id` cookie.
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  const body = (await request.json().catch(() => ({}))) as Body;
  if (!Array.isArray(body.events) || !body.version || !body.decisionId)
    return new Response(null, { status: 400 });

  // Account-scoped by default; anonymous only when the flag is on.
  if (!userId && !features.compliance.logAnonymousConsent)
    return new Response(null, { status: 204 });

  let consentId: string | null = null;
  if (!userId) {
    const jar = await cookies();
    consentId = jar.get("consent_id")?.value ?? randomUUID();
    jar.set("consent_id", consentId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 400,
      path: "/",
    });
  }

  await logConsent({
    userId,
    consentId,
    events: body.events,
    version: body.version,
    source: typeof body.source === "string" ? body.source : undefined,
    surface: "website",
    country: (await headers()).get("cf-ipcountry"),
    decisionId: body.decisionId,
  });
  return new Response(null, { status: 204 });
}
