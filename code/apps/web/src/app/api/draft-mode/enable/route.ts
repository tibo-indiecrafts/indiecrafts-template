import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { features } from "@/config";
import { client } from "@indiecrafts/sanity/client";
import { token } from "@indiecrafts/sanity/token";

/**
 * Enable draft preview. The Studio's Presentation tool calls this to
 * open a live-editing session.
 *
 *   GET /api/draft-mode/enable?sanity-preview-secret=<token>&sanity-preview-pathname=/blog/hello
 *
 * Gated by `features.studio` (the editing surface this preview belongs to):
 *   - 404 when the Studio feature is off
 *   - 503 when the Studio is on but `SANITY_API_READ_TOKEN` isn't set
 *     (avoids the confusing 500 from `defineEnableDraftMode` about a
 *     missing token; flags the misconfig explicitly instead).
 */
const handler = token
  ? defineEnableDraftMode({ client: client.withConfig({ token }) })
  : null;

export async function GET(request: Request) {
  if (!features.studio) {
    return new Response("Not found", { status: 404 });
  }
  if (!handler) {
    return new Response(
      "Draft preview unavailable — set SANITY_API_READ_TOKEN in your environment.",
      { status: 503 },
    );
  }
  return handler.GET(request);
}
