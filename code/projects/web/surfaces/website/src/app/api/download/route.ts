/**
 * Verify a signed token and redirect to a gated lead-magnet download.
 *
 * @see docs/reference/projects/web/website/src/app/api/download/route.md
 */
import { NextResponse } from "next/server";
import { features } from "@/config";
import { resolveMagnetDownload } from "@indiecrafts/modules-web-newsletter/lib/deliver-magnet";

/**
 * Gated lead-magnet download. The confirmation flow e-mails a signed, expiring
 * `token`; this route verifies it (`@indiecrafts/packages-shared-gated-delivery`, via the
 * newsletter module) and redirects to the file URL. A bad, tampered, or expired
 * token — or an unknown/disabled magnet — is a `403`, so the CDN URL is never
 * revealed to an unconfirmed request. Rides the `newsletter` feature flag.
 */
export async function GET(request: Request) {
  if (!features.newsletter) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const result = await resolveMagnetDownload(token);
  if (!result.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.redirect(result.url);
}
