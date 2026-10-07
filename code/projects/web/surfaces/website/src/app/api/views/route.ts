/**
 * Count one anonymous view of a blog post.
 *
 * @see docs/reference/projects/web/website/src/app/api/views/route.md
 */
import { localeCodes, pages, security } from "@/config";
import { clientIp, withGuard } from "@indiecrafts/packages-shared-security/guard";
import { isBlogRouteEnabled } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { recordPostView } from "@indiecrafts/modules-web-blog/lib/popularity";

/** A published Sanity id: letters, digits, `.`, `_`, `-` (no `drafts.` / `versions.`). */
const POST_ID = /^(?!drafts\.|versions\.)[A-Za-z0-9._-]{1,128}$/;

/**
 * Same-origin beacon from a post page (`PostViewBeacon`). It carries no identity: the api
 * adds 1 to the post's counter for today (`POST /v1/views`, EU D1) — no cookie, no IP stored;
 * the IP only rate-limits (here and at the api). Always 204 for a valid request, so the
 * response tells a caller nothing.
 */
const handle = withGuard(async (req, data) => {
  const body = (data ?? {}) as { postId?: unknown; locale?: unknown };
  const postId = typeof body.postId === "string" ? body.postId : "";
  const locale = typeof body.locale === "string" ? body.locale : "";
  if (!POST_ID.test(postId) || !(localeCodes as readonly string[]).includes(locale))
    return Response.json({ error: "invalid" }, { status: 400 });
  await recordPostView({ postId, locale, clientIp: clientIp(req) });
  return new Response(null, { status: 204 });
}, security.views);

export async function POST(request: Request) {
  if (!isBlogRouteEnabled(pages.blog))
    return Response.json({ error: "not_found" }, { status: 404 });
  return handle(request);
}
