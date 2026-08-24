import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/user-interface/shared/layout/Logo";
import { MadeByCredit } from "@/user-interface/shared/layout/MadeByCredit";
import { SocialFollow } from "@/user-interface/shared/layout/SocialFollow";
import { DoNotSellLink } from "@indiecrafts/packages-web-compliance/consent/DoNotSellLink";
import type { SiteSettings } from "@/lib/seo/site-seo";
import type { FooterColumn, NavLeaf } from "@/lib/navigation";

/**
 * Production site footer, colocated in `@/user-interface/layout` so the production
 * chrome is owned end-to-end.
 *
 * Renders the footer columns from the `navigation` singleton in Sanity (resolved
 * by `getNavigation`) + the social follow block. Always uses `Link` from
 * `@/i18n/routing` for internal links so locale prefixes resolve.
 */
type FooterProps = {
  /** Site name (wordmark) — resolved from Sanity, passed in. */
  name: string;
  /** Tagline under the logo — the locale's Sanity `siteMeta.tagline`. */
  tagline?: string;
  /** Copyright holder — Sanity `siteSettings.business.company`. */
  company?: string;
  logo?: string;
  logoDark?: string;
  social?: SiteSettings["social"];
  columns?: FooterColumn[];
  /** Footer maker credit — Sanity `siteSettings.madeBy`. Omitted → no credit. */
  madeBy?: SiteSettings["madeBy"];
  /** CCPA "Do Not Sell or Share" link — shown only for opt-out (US/CCPA) visitors,
   *  resolved server-side (`resolveConsentMode`) by the caller. */
  showDoNotSell?: boolean;
};

const linkClass =
  "text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none";

function FooterLink({ item }: { item: NavLeaf }) {
  if (item.kind === "external") {
    return (
      <a
        href={item.href}
        target={item.newTab ? "_blank" : undefined}
        rel={item.newTab ? "noopener noreferrer" : undefined}
        className={linkClass}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link
      href={item.href}
      target={item.newTab ? "_blank" : undefined}
      className={linkClass}
    >
      {item.label}
    </Link>
  );
}

export function Footer({
  name,
  tagline,
  company,
  logo,
  logoDark,
  social,
  columns = [],
  madeBy,
  showDoNotSell = false,
}: FooterProps) {
  const tFooter = useTranslations("footer");
  const tCookies = useTranslations("cookies");
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto max-w-(--max-container) px-(--gutter) py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo name={name} logo={logo} logoDark={logoDark} />
            {tagline ? (
              <p className="text-muted-foreground mt-2 text-sm">{tagline}</p>
            ) : null}
            {social ? (
              <div className="mt-5">
                <SocialFollow social={social} label={tFooter("follow")} />
              </div>
            ) : null}
          </div>
          {columns.map((column, i) => (
            <nav key={`${column.title}-${i}`} aria-label={column.title}>
              <h2 className="mb-3 text-sm font-semibold">{column.title}</h2>
              <ul className="space-y-2 text-sm">
                {column.links.map((item, j) => (
                  <li key={`${item.href}-${j}`}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="text-muted-foreground mt-12 text-xs">
          © {year} {company ?? name}. {tFooter("rights")}
        </p>
        {showDoNotSell ? (
          <div className="mt-2">
            <DoNotSellLink show label={tCookies("doNotSell.link")} />
          </div>
        ) : null}
        {madeBy ? <MadeByCredit madeBy={madeBy} /> : null}
      </div>
    </footer>
  );
}
