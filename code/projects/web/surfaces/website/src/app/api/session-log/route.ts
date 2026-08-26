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
  const body = (await request.json().catch(() => ({}))) as {
    surface?: unknown;
    locale?: unknown;
  };
  const surface = typeof body.surface === "string" ? body.surface : appSurface;
  const locale = typeof body.locale === "string" ? body.locale : null;
  await logSession({
    surface,
    userId,
    sessionId,
    country: request.headers.get("cf-ipcountry"),
    locale,
  });
  return new Response(null, { status: 204 });
}
