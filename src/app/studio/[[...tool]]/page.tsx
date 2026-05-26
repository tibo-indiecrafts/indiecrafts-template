/**
 * Embedded Sanity Studio route.
 *
 * - Catch-all `[[...tool]]` so the Studio's internal routing works.
 * - Mounts a client wrapper from `@/sanity/Studio` because the Studio
 *   bundle uses React client-only APIs.
 * - Sits OUTSIDE `[locale]/` so it's never localized; the proxy.ts
 *   matcher excludes `/studio` from next-intl rewrites.
 */

import { Studio } from "@/sanity/Studio";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
