import type { CSSProperties } from "react";
import { BrandIcon, BRANDS } from "@indiecrafts/packages-shared-ui-icons/web";
import { socialLinks } from "@/lib/social";
import type { SiteSettings } from "@/lib/seo/site-seo";

/**
 * Footer follow block — the site's social profiles as icon links, driven by
 * Sanity (`siteSettings.social`) through `socialLinks`, the same source that
 * feeds the Organization `sameAs` JSON-LD. Renders nothing when no profile is
 * set (so the eyebrow never shows alone).
 *
 * Signature detail: each icon rests in `muted-foreground` and, on hover/focus,
 * adopts its platform's official brand color (the mark's own hex, exposed as a
 * `--brand` custom property) — a small identity cue, not decoration. `rel="me"`
 * marks each link as the site's verified profile (the IndieWeb complement to
 * `sameAs`).
 */
export function SocialFollow({
  social,
  label,
}: {
  social: SiteSettings["social"];
  label: string;
}) {
  const links = socialLinks(social);
  if (!links.length) return null;

  return (
    <div>
      <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {label}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1">
        {links.map((l) => (
          <li key={l.platform}>
            <a
              href={l.url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={l.label}
              style={{ "--brand": BRANDS[l.brand].hex } as CSSProperties}
              className="text-muted-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-10 items-center justify-center rounded-md transition-colors hover:[color:var(--brand)] focus-visible:[color:var(--brand)] focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none"
            >
              <BrandIcon name={l.brand} size={20} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
