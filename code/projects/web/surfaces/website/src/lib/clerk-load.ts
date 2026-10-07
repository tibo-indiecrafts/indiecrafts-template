/**
 * Decide whether a request mounts Clerk on the website.
 *
 * @see docs/reference/projects/web/website/src/lib/clerk-load.md
 */
import "server-only";
import { auth } from "@clerk/nextjs/server";
import { localeCodes } from "@/config";

/** The pages that render Clerk's UI for a signed-out visitor. */
const SIGNED_OUT_CLERK_ROUTES = ["/sign-in", "/sign-up"];

/** True for `/sign-in`, `/fr/sign-up/verify`, … — the request path, locale prefix or not. */
export function isClerkRoute(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if ((localeCodes as readonly string[]).includes(segments[0] ?? "")) segments.shift();
  const route = `/${segments[0] ?? ""}`;
  return SIGNED_OUT_CLERK_ROUTES.includes(route);
}

/**
 * Clerk (its React bundle + the ClerkJS scripts from its CDN, ~135 kB + ~300 KiB) loads only
 * when someone needs it: a signed-in visitor (`auth()`, verified by `clerkMiddleware`) or the
 * sign-in / sign-up pages. Everyone else gets the header's plain sign-in link. Off without a
 * Clerk key. `pathname` is the proxy's `x-pathname`.
 */
export async function shouldLoadClerk(pathname: string | null): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return false;
  if (pathname && isClerkRoute(pathname)) return true;
  return (await auth()).userId !== null;
}
