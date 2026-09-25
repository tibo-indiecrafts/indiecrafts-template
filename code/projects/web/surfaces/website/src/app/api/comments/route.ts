/**
 * Accept a public blog comment submission.
 *
 * @see docs/reference/projects/web/website/src/app/api/comments/route.md
 */
import { NextResponse } from "next/server";
import { security } from "@/config";
import { withGuard } from "@indiecrafts/packages-shared-security/guard";
import { isCommentsEnabled } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { createComment } from "@indiecrafts/modules-web-blog/lib/comments";
import { getConsentPolicyVersion } from "@indiecrafts/packages-web-compliance/sanity/policy-version";

/**
 * Public comment submission. `withGuard` hardens the boundary (same-site origin,
 * body cap, rate limit, optional Turnstile) and parses the body once; the module's
 * `createComment` validates, whitelists, and writes. A honeypot-flagged submission
 * returns `201` too, so bots can't tell it was dropped.
 */
const handle = withGuard(async (_req, data) => {
  const body = (data ?? {}) as Record<string, unknown>;
  const result = await createComment(
    {
      postId: String(body.postId ?? ""),
      authorName: String(body.authorName ?? ""),
      authorEmail: body.authorEmail ? String(body.authorEmail) : undefined,
      body: String(body.body ?? ""),
      consent: body.consent === true,
      parentId: body.parentId ? String(body.parentId) : undefined,
      honeypot: body.honeypot ? String(body.honeypot) : undefined,
      startedAt: typeof body.startedAt === "number" ? body.startedAt : undefined,
    },
    new Date().toISOString(),
    await getConsentPolicyVersion(),
  );
  // A real create and a silently-dropped spam both look like success.
  if (result.ok || result.error === "spam")
    return NextResponse.json({ ok: true }, { status: 201 });
  if (result.error === "invalid")
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  return NextResponse.json({ error: "server" }, { status: 500 });
}, security.comments);

export async function POST(request: Request) {
  if (!isCommentsEnabled()) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return handle(request);
}
