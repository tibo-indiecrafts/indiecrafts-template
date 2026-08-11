import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/user-interface/shared/layout/Logo";
import { MadeByCredit } from "@/user-interface/shared/layout/MadeByCredit";
import { SocialFollow } from "@/user-interface/shared/layout/SocialFollow";
import { footerNav } from "@/config";
import { site } from "@/config";
import type { SiteSettings } from "@/lib/seo/site-seo";

/**
 * Production site footer, colocated in `@/user-interface/layout` so the production
 * chrome is owned end-to-end.
 *
 * Renders nav groups from `footerNav` in `@/config` (a "Company" group with
 * a `/legal` link when `features.legalPage` is on; add more groups as pages
 * get wired). Always uses `Link` from `@/i18n/routing` so locale prefixes
 * resolve.
 */
type FooterProps = {
  logo?: string;
  logoDark?: string;
  social?: SiteSettings["social"];
};

export function Footer({ logo, logoDark, social }: FooterProps) {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto max-w-(--max-container) px-(--gutter) py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo logo={logo} logoDark={logoDark} />
            <p className="text-muted-foreground mt-2 text-sm">{site.tagline}</p>
            {social ? (
              <div className="mt-5">
                <SocialFollow social={social} label={tFooter("follow")} />
              </div>
            ) : null}
          </div>
          {footerNav.map((group) => (
            <nav key={group.labelKey} aria-label={tNav(group.labelKey)}>
              <h2 className="mb-3 text-sm font-semibold">{tNav(group.labelKey)}</h2>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {tNav(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="text-muted-foreground mt-12 text-xs">
          © {year} {site.legal.company}. {tFooter("rights")}
        </p>
        <MadeByCredit />
      </div>
    </footer>
  );
}
