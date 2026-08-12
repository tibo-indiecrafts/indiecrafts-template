/**
 * Embedded Sanity Studio route.
 *
 * - Catch-all `[[...tool]]` so the Studio's internal routing works.
 * - Mounts a client wrapper from `@/sanity/Studio` because the Studio
 *   bundle uses React client-only APIs.
 * - Sits OUTSIDE `[locale]/` so it's never localized; the proxy.ts
 *   matcher excludes `/studio` from next-intl rewrites.
 * - Gated by `features.studio` (independent of the public `features.blog`)
 *   — off ⇒ the whole Studio 404s while the public site is untouched.
 */

import { notFound } from "next/navigation";
import { features } from "@indiecrafts/config";
import { Studio } from "@/sanity/Studio";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!features.studio) notFound();
  return <Studio />;
}
