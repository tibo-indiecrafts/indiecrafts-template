/**
 * Rewrite a request to the maintenance page when the site is down.
 *
 * @see docs/reference/packages/shared/system-pages/src/proxy.md
 */
import { NextResponse, type NextRequest } from "next/server";

/**
 * Site-wide maintenance rewrite for an app's `proxy.ts` (Next middleware). When
 * `isDown` is true, rewrites every matched request to `/maintenance` and answers
 * **503** (temporary — preserves search ranking) with a `Retry-After` hint. The
 * `startsWith("/maintenance")` guard stops the rewrite looping on itself. Returns
 * `null` when not down — the caller continues its normal pipeline (next-intl).
 *
 * **Pure** — the caller decides `isDown` (e.g. the build-time `features.maintenance`
 * flag OR a live Sanity toggle), so this brick stays Sanity-free:
 *
 *   const isDown = features.maintenance || (await getMaintenanceMode());
 *   const res = maintenanceRewrite(request, isDown);
 *   if (res) return res;
 *   return intlMiddleware(request);
 */
export function maintenanceRewrite(
  request: NextRequest,
  isDown: boolean,
): NextResponse | null {
  if (isDown && !request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.rewrite(new URL("/maintenance", request.url), {
      status: 503,
      headers: { "Retry-After": "3600" },
    });
  }
  return null;
}
