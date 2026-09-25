"use client";

/**
 * Render the Sanity Studio inside a Next client boundary.
 *
 * @see docs/reference/projects/web/website/src/sanity/Studio.md
 */

import { NextStudio } from "next-sanity/studio";
import config from "../../sanity.config";

/**
 * Client wrapper around `<NextStudio>`. The Studio module hits client-only
 * React APIs (createContext, hooks) so the route can't import it directly
 * from a server component. The catch-all page below just renders this.
 */
export function Studio() {
  return <NextStudio config={config} />;
}
