/**
 * Clear the site's cached pages when an editor publishes in Sanity.
 *
 * @see docs/reference/projects/web/website/src/app/api/revalidate/route.md
 */
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { logger } from "@indiecrafts/packages-shared-logger";

/**
 * Target of the Sanity "publish" webhook (one per deployed site URL).
 *
 *   POST /api/revalidate   (signed: `sanity-webhook-signature`)
 *
 * `<SanityLive>` only revalidates while a visitor has the site open, and it never
 * clears a cached "not found": a newly published post would stay 404. This purges
 * every page and the Sanity reads cached under it.
 *   - 503 when `SANITY_REVALIDATE_SECRET` isn't set (misconfig, said explicitly)
 *   - 401 when the signature is missing or wrong
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new Response(
      "Revalidation unavailable — set SANITY_REVALIDATE_SECRET in your environment.",
      { status: 503 },
    );
  }
  // `true`: wait until the published change is readable before purging.
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    request,
    secret,
    true,
  );
  if (isValidSignature !== true) {
    return new Response("Invalid signature", { status: 401 });
  }
  // ponytail: purges the whole site per publish; per-document tags if traffic makes that costly.
  revalidatePath("/", "layout");
  logger.info("sanity publish: site revalidated", { type: body?._type });
  return Response.json({ revalidated: true });
}
