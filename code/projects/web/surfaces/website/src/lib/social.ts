/**
 * Build the ordered list of the site's social profiles for the footer and JSON-LD.
 *
 * @see docs/reference/projects/web/website/src/lib/social.md
 */

import type { BrandName } from "@indiecrafts/packages-web-ui-icons/shared";
import type { SiteSettings } from "@/lib/seo/site-seo";

export type SocialLink = {
  platform: keyof SiteSettings["social"];
  label: string;
  url: string;
  /** Brand mark name in `@indiecrafts/packages-web-ui-icons` — render with its `BrandIcon`. */
  brand: BrandName;
};

/**
 * The site's social profiles as an ordered, ready-to-render list — the single
 * source shared by the footer follow block AND the Organization `sameAs`
 * JSON-LD, so the two can never drift. Only non-empty profiles are included; the
 * twitter `@handle` is converted to its profile URL once, here. Brand marks come
 * from the shared `ui-icons` brick (one source for every mark).
 */
export function socialLinks(social: SiteSettings["social"]): SocialLink[] {
  const entries: [SocialLink["platform"], string, string | undefined, BrandName][] = [
    [
      "twitter",
      "X",
      social.twitter && `https://x.com/${social.twitter.replace(/^@/, "").trim()}`,
      "x",
    ],
    ["linkedin", "LinkedIn", social.linkedin, "linkedin"],
    ["instagram", "Instagram", social.instagram, "instagram"],
    ["github", "GitHub", social.github, "github"],
    ["mastodon", "Mastodon", social.mastodon, "mastodon"],
  ];
  return entries.flatMap(([platform, label, raw, brand]) => {
    const url = raw?.trim();
    return url && url.startsWith("http") ? [{ platform, label, url, brand }] : [];
  });
}
