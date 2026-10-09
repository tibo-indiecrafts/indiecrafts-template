/**
 * Verify a signed token and stream a gated lead-magnet download.
 *
 * @see docs/reference/projects/web/website/src/app/api/download/route.md
 */
import { NextResponse } from "next/server";
import { logger } from "@indiecrafts/packages-shared-logger";
import { features } from "@/config";
import { resolveMagnetDownload } from "@indiecrafts/modules-web-newsletter/lib/deliver-magnet";

const FILE_CDN = "cdn.sanity.io";

/**
 * Gated lead-magnet download. The confirmation flow e-mails a signed, expiring
 * `token`; this route verifies it (`@indiecrafts/packages-shared-gated-delivery`, via the
 * newsletter module) and **streams** the file. A redirect would hand the visitor the
 * permanent CDN URL, so the link's 7-day expiry would mean nothing. A bad, tampered, or
 * expired token — or an unknown/disabled magnet — is a `403`. Rides the `newsletter`
 * feature flag. On Sanity's free plan the file stays listable from the public dataset;
 * the gate trades a freebie for an e-mail, it is not access control.
 */
export async function GET(request: Request) {
  if (!features.newsletter) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const result = await resolveMagnetDownload(token);
  // Only Sanity's file CDN: the URL comes from our dataset, never from the request.
  if (!result.ok || new URL(result.url).hostname !== FILE_CDN) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  // `?dl=` → the CDN answers as an attachment, under the file's original name.
  const file = await fetch(`${result.url}?dl=`);
  if (!file.ok || !file.body) {
    logger.error("lead magnet download failed", { status: file.status });
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
  const headers = new Headers({ "cache-control": "private, no-store" });
  for (const name of ["content-type", "content-length", "content-disposition"]) {
    const value = file.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(file.body, { headers });
}
