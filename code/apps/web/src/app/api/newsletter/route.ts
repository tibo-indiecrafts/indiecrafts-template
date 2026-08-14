import { NextResponse } from "next/server";
import { withGuard } from "@indiecrafts/security/guard";
import { isNewsletterEnabled, subscribe } from "@indiecrafts/newsletter/lib/newsletter";
import { getConsentPolicyVersion } from "@/lib/consent-policy";

/**
 * Public newsletter signup. `withGuard` hardens the boundary (same-site origin,
 * body cap, rate limit, optional Turnstile) and parses the body once; `subscribe`
 * validates, dedupes, and writes. A honeypot-flagged submission returns `201` too,
 * so bots can't tell it was dropped. `201` = created, `200` = already subscribed.
 */
const handle = withGuard(
  async (_req, data) => {
    const body = (data ?? {}) as Record<string, unknown>;
    const result = await subscribe(
      {
        email: String(body.email ?? ""),
        consent: body.consent === true,
        source: body.source ? String(body.source) : undefined,
        language: body.language ? String(body.language) : undefined,
        tags: Array.isArray(body.tags) ? body.tags.map(String) : undefined,
        honeypot: body.honeypot ? String(body.honeypot) : undefined,
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
  if (!isNewsletterEnabled()) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return handle(request);
}
