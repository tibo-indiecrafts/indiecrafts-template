import { NextResponse } from "next/server";
import { features } from "@/config";
import { withGuard } from "@indiecrafts/security/guard";
import { join } from "@indiecrafts/waitlist/lib/waitlist";
import { getConsentPolicyVersion } from "@indiecrafts/compliance/sanity/policy-version";

/**
 * Public waitlist join. `withGuard` hardens the boundary (same-site origin, body
 * cap, rate limit, optional Turnstile) and parses the body once; the module's
 * `join` validates, whitelists, and writes. A honeypot-flagged submission returns
 * `201` too, so bots can't tell it was dropped. `201` = created, `200` = already on.
 */
const handle = withGuard(
  async (_req, data) => {
    const body = (data ?? {}) as Record<string, unknown>;
    const result = await join(
      {
        email: String(body.email ?? ""),
        name: body.name ? String(body.name) : undefined,
        consent: body.consent === true,
        source: body.source ? String(body.source) : undefined,
        language: body.language ? String(body.language) : undefined,
        honeypot: body.honeypot ? String(body.honeypot) : undefined,
        startedAt: typeof body.startedAt === "number" ? body.startedAt : undefined,
      },
      new Date().toISOString(),
      await getConsentPolicyVersion(),
    );
    if (result.ok) {
      return NextResponse.json(
        { ok: true, already: result.already ?? false },
        { status: result.already ? 200 : 201 },
      );
    }
    if (result.error === "spam") return NextResponse.json({ ok: true }, { status: 201 });
    if (result.error === "invalid")
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    return NextResponse.json({ error: "server" }, { status: 500 });
  },
  { rateLimit: { limit: 5, windowSec: 600 }, turnstile: true, bodyMax: 8000 },
);

export async function POST(request: Request) {
  if (!features.waitlist) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return handle(request);
}
