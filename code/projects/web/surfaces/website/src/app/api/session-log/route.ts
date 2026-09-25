/**
 * Log a sign-in session for the current user.
 *
 * @see docs/reference/projects/web/website/src/app/api/session-log/route.md
 */
import { auth } from "@clerk/nextjs/server";
import { logSession } from "@indiecrafts/packages-web-auth/session-log";
import { surface as appSurface } from "@/config";

/**
 * Same-origin sign-in logger — the browser (`SessionLogger`) POSTs here with no secret,
 * and we forward to the audit api server-side (holding `APP_API_TOKEN`) with the app's
 * surface + the user's country. Only a signed-in caller is accepted.
 */
export async function POST(request: Request) {
  const { userId, sessionId } = await auth();
  if (!userId) return new Response(null, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { surface?: unknown };
  const surface = typeof body.surface === "string" ? body.surface : appSurface;
  await logSession({
    surface,
    userId,
    sessionId,
    country: request.headers.get("cf-ipcountry"),
  });
  return new Response(null, { status: 204 });
}
