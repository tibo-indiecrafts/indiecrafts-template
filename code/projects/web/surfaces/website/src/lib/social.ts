import { X, Instagram, Mastodon, Github } from "reicon-brands";
import type { BrandMark } from "@/user-interface/shared/components/BrandIcon";
import type { SiteSettings } from "@/lib/seo/site-seo";

/**
 * LinkedIn mark — `reicon-brands` doesn't ship it (trademark). Hand-declared
 * from Simple Icons, same `BrandMark` shape `BrandIcon` renders (see
 * `BrandIcon.tsx`). viewBox is 0 0 24 24 like every other mark.
 */
const Linkedin: BrandMark = {
  hex: "0A66C2",
  title: "LinkedIn",
  svgContent: `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`,
};

export type SocialLink = {
  platform: keyof SiteSettings["social"];
  label: string;
  url: string;
  mark: BrandMark;
};

/**
 * The site's social profiles as an ordered, ready-to-render list — the single
 * source shared by the footer follow block AND the Organization `sameAs`
 * JSON-LD, so the two can never drift. Only non-empty profiles are included; the
 * twitter `@handle` is converted to its profile URL once, here.
 */
export function socialLinks(social: SiteSettings["social"]): SocialLink[] {
  const entries: [SocialLink["platform"], string, string | undefined, BrandMark][] = [
    [
      "twitter",
      "X",
      social.twitter && `https://x.com/${social.twitter.replace(/^@/, "").trim()}`,
      X,
    ],
    ["linkedin", "LinkedIn", social.linkedin, Linkedin],
    ["instagram", "Instagram", social.instagram, Instagram],
    ["github", "GitHub", social.github, Github],
    ["mastodon", "Mastodon", social.mastodon, Mastodon],
  ];
  return entries.flatMap(([platform, label, raw, mark]) => {
    const url = raw?.trim();
    return url && url.startsWith("http") ? [{ platform, label, url, mark }] : [];
  });
}
