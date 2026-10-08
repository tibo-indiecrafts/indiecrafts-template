/**
 * Redirect anyone but a signed-in admin to sign-in, failing closed.
 *
 * @see docs/reference/projects/web/admin/src/lib/require-admin.md
 */
import "server-only";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@indiecrafts/packages-shared-auth";
import { redirect } from "@/i18n/routing";

/**
 * The admin gate for a dashboard route. The `(dashboard)` layout calls it, and so does
 * EVERY page before it reads data: Next skips a shared layout on a client navigation
 * (partial rendering), so a layout check alone does not guard a page's data. The proxy is
 * coarse routing only (bypassable — Next.js CVE-2025-29927). Unconfigured Clerk (no
 * publishable key) redirects too, so a deploy that forgot Clerk is locked, not exposed.
 * `page-gate.test.ts` fails when a dashboard page does not call it.
 */
export async function requireAdminPage(locale: string): Promise<void> {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
    return redirect({ href: "/sign-in", locale });
  const { sessionClaims } = await auth();
  if (!isAdmin(sessionClaims)) redirect({ href: "/sign-in", locale });
}
