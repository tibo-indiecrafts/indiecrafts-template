import { features, getCurrentEnvironment, isSiteConfigured, site } from "@indiecrafts/config";

/**
 * robots.txt as a Route Handler (not the typed `robots.ts` metadata route) so
 * it can emit a `/llms.txt` pointer alongside the standard directives.
 *
 * ONLY the production environment with a configured origin is indexable.
 * Every other deployment — local dev, Vercel preview, staging, test, or prod
 * still on the placeholder URL — serves a full `Disallow: /` so it stays
 * "quiet when online" and never leaks into search.
 *
 *   environment → `getCurrentEnvironment()`  (NODE_ENV + NEXT_PUBLIC_ENVIRONMENT)
 *   origin      → `site.url`                 (NEXT_PUBLIC_SITE_URL, prod)
 */
export function GET(): Response {
  const indexable = getCurrentEnvironment() === "production" && isSiteConfigured;

  const body = indexable
    ? [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/",
        "Disallow: /_next/",
        ...(features.sitemap ? [`Sitemap: ${site.url}/sitemap.xml`] : []),
        ...(features.llms.index ? [`# llms.txt: ${site.url}/llms.txt`] : []),
        `Host: ${site.url}`,
      ]
    : ["User-agent: *", "Disallow: /"];

  return new Response(`${body.join("\n")}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
