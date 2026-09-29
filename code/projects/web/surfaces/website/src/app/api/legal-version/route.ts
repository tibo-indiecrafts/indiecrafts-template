/**
 * Expose the effective legal version so the app + mobile share the website's version.
 *
 * @see docs/reference/projects/web/website/src/app/api/legal-version/route.md
 */
import { NextResponse } from "next/server";
import { getLegalAcceptance } from "@indiecrafts/packages-web-compliance/sanity/legal";
import { defaultLocale, features } from "@/config";

/**
 * The effective legal version — the SAME string the re-acceptance banner uses
 * (`getLegalAcceptance(...).version`: an optional manual bump + each ENABLED legal
 * page's lastUpdated date). The `app` surface (also inside the Capacitor shell) fetches
 * this so every surface re-prompts on ONE Sanity bump and compares the SAME version string (a per-surface
 * static `policyVersion` would never match the website's). The version is
 * locale-independent (dates, not copy), so it reads the default locale. `no-store` so a
 * CDN can't serve a stale version, and CORS `*` because it is public, read-only, and
 * non-credentialed (the cross-origin `app` surface fetches it).
 */
export async function GET() {
  const { version } = await getLegalAcceptance(defaultLocale, features.legal);
  return NextResponse.json(
    { version },
    {
      headers: {
        "cache-control": "no-store, max-age=0",
        "access-control-allow-origin": "*",
      },
    },
  );
}
