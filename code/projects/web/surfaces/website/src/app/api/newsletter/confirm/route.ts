/**
 * Confirm a newsletter double opt-in from a one-time token.
 *
 * @see docs/reference/projects/web/website/src/app/api/newsletter/confirm/route.md
 */
import { NextResponse } from "next/server";
import { features, security } from "@/config";
import { withGuard } from "@indiecrafts/packages-shared-security/guard";
import { confirmSubscription } from "@indiecrafts/modules-web-newsletter/lib/confirm";

/**
 * Double opt-in confirm — **POST only**. A bare GET never mutates, so a mail
 * scanner / link prefetcher (Outlook SafeLinks, etc.) can't auto-confirm. The
 * confirmation email links to the `[locale]/newsletter/confirm` page with the signed
 * token in the URL fragment; the page's button POSTs it here. `withGuard` rate-limits
 * (the token is the auth, so no Turnstile). Answers `{ status: "confirmed" | "invalid" }`,
 * or `502 { status: "error" }` when the subscriber could not be stored (the visitor can
 * tap again).
 */
const handle = withGuard(async (_req, data) => {
  const token = String((data as Record<string, unknown> | null)?.token ?? "");
  const status = await confirmSubscription(token);
  return NextResponse.json({ status }, { status: status === "error" ? 502 : 200 });
}, security.confirm);

export async function POST(request: Request) {
  if (!features.newsletter) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return handle(request);
}
