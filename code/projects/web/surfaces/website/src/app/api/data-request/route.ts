import { NextResponse } from "next/server";
import { features } from "@/config";
import { withGuard } from "@indiecrafts/security/guard";
import { submitDataRequest } from "@indiecrafts/compliance/requests/submit";
import { getConsentPolicyVersion } from "@indiecrafts/compliance/sanity/policy-version";

/**
 * Public GDPR data-subject request. `withGuard` hardens the boundary (same-site
 * origin, body cap, rate limit, optional Turnstile) and parses the body once;
 * `submitDataRequest` validates, stores a `dataRequest` record, and alerts the
 * controller. A honeypot-flagged submission returns `201` too, so bots can't tell
 * it was dropped. `201` = received.
 */
const handle = withGuard(
  async (_req, data) => {
    const body = (data ?? {}) as Record<string, unknown>;
    const result = await submitDataRequest(
      {
        email: String(body.email ?? ""),
        requestType: String(body.requestType ?? ""),
        consent: body.consent === true,
        message: body.message ? String(body.message) : undefined,
        source: body.source ? String(body.source) : undefined,
        language: body.language ? String(body.language) : undefined,
        honeypot: body.honeypot ? String(body.honeypot) : undefined,
        startedAt: typeof body.startedAt === "number" ? body.startedAt : undefined,
      },
      new Date().toISOString(),
      await getConsentPolicyVersion(),
    );
    if (result.ok) return NextResponse.json({ ok: true }, { status: 201 });
    if (result.error === "spam") return NextResponse.json({ ok: true }, { status: 201 });
    if (result.error === "invalid")
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    return NextResponse.json({ error: "server" }, { status: 500 });
  },
  { rateLimit: { limit: 5, windowSec: 600 }, turnstile: true, bodyMax: 8000 },
);

export async function POST(request: Request) {
  if (!features.legal.dataRequest) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return handle(request);
}
