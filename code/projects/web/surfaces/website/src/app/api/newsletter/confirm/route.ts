import { NextResponse } from "next/server";
import { features } from "@/config";
import { withGuard } from "@indiecrafts/security/guard";
import { confirmSubscriber } from "@indiecrafts/newsletter/lib/confirm";

/**
 * Double opt-in confirm — **POST only**. A bare GET never mutates, so a mail
 * scanner / link prefetcher (Outlook SafeLinks, etc.) can't auto-confirm. The
 * confirmation email links to the `[locale]/newsletter/confirm` page, whose button
 * POSTs the one-time `token` here. `withGuard` rate-limits (the token is the auth,
 * so no Turnstile). Returns `{ status: "confirmed" | "invalid" }`.
 */
const handle = withGuard(
  async (_req, data) => {
    const token = String((data as Record<string, unknown> | null)?.token ?? "");
    const status = await confirmSubscriber(token);
    return NextResponse.json({ status });
  },
  { rateLimit: { limit: 10, windowSec: 600 }, bodyMax: 2000 },
);

export async function POST(request: Request) {
  if (!features.newsletter) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return handle(request);
}
