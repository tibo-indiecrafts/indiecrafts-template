/**
 * Serve robots.txt, indexable only in production with a configured origin.
 *
 * @see docs/reference/projects/web/website/src/app/robots.txt/route.md
 */
import {
  AI_TRAINING_USER_AGENTS,
  features,
  getCurrentEnvironment,
  isSiteConfigured,
  site,
} from "@/config";

/**
 * robots.txt as a Route Handler (not the typed `robots.ts` metadata route) so
 * it can emit a `/llms.txt` pointer alongside the standard directives.
 *
 * ONLY the production environment with a configured origin is indexable.
 * Every other deployment — local dev, a preview deploy, staging, test, or prod
 * still on the placeholder URL — serves a full `Disallow: /` so it stays
 * "quiet when online" and never leaks into search.
 *
 * When indexable + `features.blockAiTraining`, the AI **training** crawlers in
 * `AI_TRAINING_USER_AGENTS` get their own `Disallow: /` groups BEFORE the
 * `User-agent: *` allow group. Robots.txt matches the most specific user-agent, so
 * only the named training bots are blocked — search + AI-search crawlers (Googlebot,
 * Bingbot, PerplexityBot, …) fall through to `*` and keep indexing.
 *
 *   environment → `getCurrentEnvironment()`  (NODE_ENV + NEXT_PUBLIC_ENVIRONMENT)
 *   origin      → `site.url`                 (NEXT_PUBLIC_SITE_URL, prod)
 */
export function robotsTxt(opts: {
  indexable: boolean;
  blockAiTraining: boolean;
  aiTrainingBots: readonly string[];
  siteUrl: string;
  sitemap: boolean;
  llmsIndex: boolean;
}): string {
  if (!opts.indexable) return "User-agent: *\nDisallow: /\n";

  const lines: string[] = [];
  // AI training crawlers — each its own group, so `*` below still allows search bots.
  if (opts.blockAiTraining) {
    for (const bot of opts.aiTrainingBots) {
      lines.push(`User-agent: ${bot}`, "Disallow: /", "");
    }
  }
  lines.push(
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /_next/",
    ...(opts.sitemap ? [`Sitemap: ${opts.siteUrl}/sitemap.xml`] : []),
    ...(opts.llmsIndex ? [`# llms.txt: ${opts.siteUrl}/llms.txt`] : []),
    `Host: ${opts.siteUrl}`,
  );
  return `${lines.join("\n")}\n`;
}

export function GET(): Response {
  const body = robotsTxt({
    indexable: getCurrentEnvironment() === "production" && isSiteConfigured,
    blockAiTraining: features.blockAiTraining,
    aiTrainingBots: AI_TRAINING_USER_AGENTS,
    siteUrl: site.url,
    sitemap: features.sitemap,
    llmsIndex: features.llms.index,
  });

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
